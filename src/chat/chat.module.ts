import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './schema/message.schema';
import { RoomSchema } from '../room/schema/room.schema';
import { Module } from '@nestjs/common';
import { UserSchema } from '../user/schema/user.schema';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL || ''),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Room', schema: RoomSchema },
      { name: 'Message', schema: MessageSchema },
    ]),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
