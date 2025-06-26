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
import { CreateChatDTO } from './dto/create-chat.dto';

@WebSocketGateway(3010, { cors: true, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly chatService: ChatService) {}

  // lifecylce websocket: ketika pertama kali connect
  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);

    // mengirim ke semua client yang bukan user client(sekarang)
    client.broadcast.emit('user-joined', {
      message: `User joined the chat: ${client.id}`,
      clientId: client.id,
    });
  }

  // lifecycle websocket: ketika sudah disconnect
  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);

    // mengirim ke semua client
    this.server.emit('user-left', {
      message: `User left the chat: ${client.id}`,
      clientsId: client.id,
    });
  }

  // socket untuk mengirim message
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

  // socket untuk mendapatkan messages
  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.getMessagesByRoom(roomId);
    client.emit('messageHistory', messages.reverse());
  }

  @SubscribeMessage('createMessage')
  async create(
    @ConnectedSocket() client,
    @MessageBody() createChatDTO: CreateChatDTO,
  ) {
    const senderId: string = client.handshake.user._id.toString();
    const chat = await this.chatService.create(senderId, createChatDTO);

    this.server.emit('newChat', chat);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(roomId);
    client.emit('joinedRoom', roomId);
  }

  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(
    @MessageBody() data: { roomId: string; senderId: string; content: string },
  ) {
    const saved = await this.chatService.saveMessage(data);
    this.server.to(data.roomId).emit('message', saved);
  }
}
