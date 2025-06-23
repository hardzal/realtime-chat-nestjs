import { Document, Types } from 'mongoose';

export interface Room extends Document {
  readonly isPrivate: boolean;
  readonly members: Types.ObjectId[];
  readonly createdAt: Date;
}
