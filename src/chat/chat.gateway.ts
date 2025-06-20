/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { InjectModel } from '@nestjs/mongoose';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { isValidObjectId, Model } from 'mongoose';
import { Server } from 'socket.io';
import { Message } from '../interfaces/message.interface';

@WebSocketGateway(3010, { cors: true, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) {}

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

    const message = new this.messageModel(data);
    await message.save();

    this.server.to(data.roomId).emit('message', message);
  }
}
