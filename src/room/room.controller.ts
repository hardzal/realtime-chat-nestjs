import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { ChatService } from 'src/chat/chat.service';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateRoomDTO } from './dto/create-room.dto';
import { GetChatDTO } from 'src/chat/dto/get-chat.dto';

@Controller('rooms')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly chatService: ChatService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Request() req, @Body() createRoomDTO: CreateRoomDTO) {
    return this.roomService.create(req.user._id.toString(), createRoomDTO);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getByRequest(@Request() req) {
    return this.roomService.getByRequest(req.user._id.toString());
  }

  @Get('/:id/chats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true })
  getChats(@Param('id') identity, @Query() dto: GetChatDTO) {
    return this.chatService.findAll(identity, new GetChatDTO(dto));
  }
}
