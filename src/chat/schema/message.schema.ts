import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../user/schema/user.schema';
import { Room } from '../../room/schema/room.schema';

@Schema({ timestamps: true, versionKey: false })
export class Message extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Room.name,
  })
  roomId: Room;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    auto: true,
  })
  senderId: User;

  @Prop({ required: true })
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
