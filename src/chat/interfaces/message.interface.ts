import { Document, Types } from 'mongoose';

export interface Message extends Document {
  readonly roomId: Types.ObjectId | string;
  readonly senderId: Types.ObjectId | string;
  readonly content: string;
  readonly timestamp: Date;
}
