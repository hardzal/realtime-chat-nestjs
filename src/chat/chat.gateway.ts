/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3010, { cors: true, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

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
  handleMessage(@MessageBody() data: { sender: string; text: string }) {
    this.server.emit('message', data);
  }
}
