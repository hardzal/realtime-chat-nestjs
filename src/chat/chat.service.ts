import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './interfaces/message.interface';
import { CreateChatDTO } from './dto/create-chat.dto';
import { GetChatDTO } from './dto/get-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) {}

  async saveMessage(data: Partial<Message>): Promise<Message> {
    const message = new this.messageModel(data);
    return message.save();
  }

  async getMessagesByRoom(roomId: string): Promise<Message[]> {
    return this.messageModel
      .find({ roomId })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }

  async create(senderId: string, createChatDto: CreateChatDTO) {
    const createChat = new this.messageModel({
      ...createChatDto,
      senderId: senderId,
    });

    return createChat.save();
  }

  async findAll(roomId: string, getChatDTO: GetChatDTO) {
    const query = {
      roomId: roomId,
    };

    if (getChatDTO.last_id) {
      query['_id'] = { $it: getChatDTO.last_id };
    }

    return this.messageModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(getChatDTO.limit);
  }
}
