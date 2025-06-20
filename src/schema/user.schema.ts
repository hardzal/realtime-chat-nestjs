import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  id: { type: Schema.Types.ObjectId },
  username: String,
  password: String,
});
