/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { isValidObjectId } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway(3010, { cors: true, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);

    client.broadcast.emit('user-joined', {
      message: `User joined the chat: ${client.id}`,
      clientId: client.id,
    });
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);

    this.server.emit('user-left', {
      message: `User left the chat: ${client.id}`,
      clientsId: client.id,
    });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { roomId: string; senderId: string; content: string },
  ) {
    if (!isValidObjectId(data.roomId) || !isValidObjectId(data.senderId)) {
      throw new WsException('Invalid roomId or senderId format');
    }

    const message = await this.chatService.saveMessage(data);

    this.server.to(data.roomId).emit('message', message);
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.getMessagesByRoom(roomId);
    client.emit('messageHistory', messages.reverse());
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(roomId);
    client.emit('joinedRoom', roomId);
  }

  @SubscribeMessage('startPrivateChat')
  async handlePrivateChat(
    @MessageBody() data: { userA: string; userB: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.chatService.findOrCreatePrivateRoom(
      data.userA,
      data.userB,
    );
    client.join((room._id as any).toString());
    client.emit('joinedPrivateRoom', room._id);
  }

  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(
    @MessageBody() data: { roomId: string; senderId: string; content: string },
  ) {
    const saved = await this.chatService.saveMessage(data);
    this.server.to(data.roomId).emit('message', saved);
  }
}
