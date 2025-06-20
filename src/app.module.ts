import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url:
        process.env.DATABASE_URL ||
        'mongodb+srv://sakuna_root:MxkA2vXRhhKzwL9s@cluster0.1mium.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      database: 'chat-app',
      entities: [Message],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Message]),
  ],
  providers: [ChatGateway],
})
export class AppModule {}
