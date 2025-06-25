import { Schema } from 'mongoose';

export const MessageSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
  senderId: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  timestamp: { type: Date, default: Date.now },
});
