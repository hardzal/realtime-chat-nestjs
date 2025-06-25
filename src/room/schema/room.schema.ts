/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoomType } from '../enum/room-type.enum';
import mongoose, { Types } from 'mongoose';
import { User } from '../../user/schema/user.schema';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Room {
  @Prop()
  name: string;

  @Prop({ enum: RoomType, default: RoomType.PERSONAL })
  type: RoomType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  participants: User[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);

export class RoomDocument {
  _id: Types.ObjectId | undefined;
  name: string | undefined;
  type: RoomType | undefined;
  participants: User[] | undefined;

  constructor(props: Partial<RoomDocument>, currentUserId?: string) {
    this._id = props._id;
    this.participants = props.participants;
    this.name = props.name;
    this.type = props.type;

    if (this.participants && this.type == RoomType.PERSONAL && currentUserId) {
      const other = this.participants.find(
        (p: any) => p._id.toString() !== currentUserId.toString(),
      );
      this.name = other?.name ?? this.name;
    }
  }
}
