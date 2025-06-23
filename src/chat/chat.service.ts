import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../interfaces/message.interface';
import { Room } from '../interfaces/room.interface';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    @InjectModel('Room') private readonly roomModel: Model<Room>,
  ) {}

  async saveMessage(data: Partial<Message>): Promise<Message> {
    const message = new this.messageModel(data);
    return message.save();
  }

  async getMessagesByRoom(roomId: string): Promise<Message[]> {
    return this.messageModel
      .find({ roomId })
      .sort({ timestamp: -1 })
      .limit(50)
      .exec();
  }

  async findOrCreatePrivateRoom(userA: string, userB: string): Promise<Room> {
    const existing = await this.roomModel.findOne({
      isPrivate: true,
      members: { $all: [userA, userB], $size: 2 },
    });

    if (existing) {
      return existing;
    }

    const newRoom = new this.roomModel({ members: [userA, userB] });
    return newRoom.save();
  }
}
