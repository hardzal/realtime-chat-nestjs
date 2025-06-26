import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty()
  readonly about: string;

  @ApiProperty()
  readonly gender: string;

  @ApiProperty()
  readonly birthday: Date;
}
