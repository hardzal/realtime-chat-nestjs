import { Body, Controller, Patch, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Request() req, @Body() updateUserDTO: UpdateUserDTO) {
    return this.usersService.update(req.user._id.toString(), updateUserDTO);
  }
}
