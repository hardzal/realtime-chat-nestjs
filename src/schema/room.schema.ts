import { Schema } from 'mongoose';

export const RoomSchema = new Schema({
  isPrivate: { type: Boolean, default: false },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});
