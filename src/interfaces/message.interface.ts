import { Document } from 'mongoose';

export interface Message extends Document {
  readonly roomId: string;
  readonly senderId: string;
  readonly content: string;
  readonly timestamp: Date;
}
