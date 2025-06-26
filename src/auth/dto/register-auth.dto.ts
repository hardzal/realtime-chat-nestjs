import { ApiProperty, PartialType } from '@nestjs/swagger';
import { LoginAUthDTO } from './login-auth.dto';
import { IsNotEmpty, MinLength } from 'class-validator';

export class RegisterAuthDTO extends PartialType(LoginAUthDTO) {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  username: string;
}
