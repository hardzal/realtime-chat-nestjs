import { Document } from 'mongoose';
import { RoomType } from '../enum/room-type.enum';
import { User } from '../../user/schema/user.schema';

export interface Room extends Document {
  readonly participants: User[];
  readonly name: string;
  readonly tyoe: RoomType;
  readonly timestamp: Date;
}
