import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginAUthDTO } from './dto/login-auth.dto';
import { RegisterAuthDTO } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginAUthDTO) {
    const validatedUser = await this.userService.validateUser(
      dto.email,
      dto.password,
    );
    const token = await this.signJwtToken(validatedUser._id.toString());

    return {
      message: 'User logged in succesfully',
      data: {
        user: validatedUser,
        token: token,
      },
    };
  }

  async register(dto: RegisterAuthDTO) {
    const createdUser = await this.userService.create(dto);
    const token = await this.signJwtToken(createdUser._id.toString());

    return {
      message: 'User created succesfully',
      data: {
        user: createdUser,
        token: token,
      },
    };
  }

  private async signJwtToken(userId: string) {
    return this.jwtService.signAsync({ sub: userId });
  }
}
