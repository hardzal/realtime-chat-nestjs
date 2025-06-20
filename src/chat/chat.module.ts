import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from '../schema/message.schema';
import { RoomSchema } from '../schema/room.schema';
import { Module } from '@nestjs/common';
import { UserSchema } from '../schema/user.schema';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DATABASE_URL ||
        'mongodb+srv://sakuna_root:MxkA2vXRhhKzwL9s@cluster0.1mium.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Room', schema: RoomSchema },
      { name: 'Message', schema: MessageSchema },
    ]),
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
