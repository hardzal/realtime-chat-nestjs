import { Schema } from 'mongoose';

export const RoomSchema = new Schema({
  name: String,
  isPrivate: { type: Boolean, default: false },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
