import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAUthDTO } from './dto/login-auth.dto';
import { RegisterAuthDTO } from './dto/register-auth.dto';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginAUthDTO) {
    return this.authService.login(dto);
  }

  @Post('register')
  register(@Body() dto: RegisterAuthDTO) {
    return this.authService.register(dto);
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  current(@Request() req) {
    return req.user;
  }
}
