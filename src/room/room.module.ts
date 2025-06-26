import { RoomSchema } from './schema/room.schema';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
