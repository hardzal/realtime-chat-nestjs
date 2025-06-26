import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './schema/room.schema';
import { Model } from 'mongoose';
import { CreateRoomDTO } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  constructor(@InjectModel('Room') private roomModel: Model<Room>) {}

  async create(userId: string, createRoomDto: CreateRoomDTO) {
    createRoomDto.participants.push(userId);

    const createRoom = new this.roomModel(createRoomDto);

    return await createRoom.save();
  }

  async getByRequest(userId: string) {
    return await this.roomModel.find({ participants: userId }).exec();
  }
}
