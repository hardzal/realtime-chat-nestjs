import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { RoomType } from '../enum/room-type.enum';

export class CreateRoomDTO {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateIf((o) => o.type != RoomType.PERSONAL)
  name: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  participants: string[];

  @ApiProperty({ required: true, default: RoomType.PERSONAL })
  @IsEnum(RoomType)
  @ValidateIf((o) => o.type)
  type: RoomType;
}
