import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterAuthDTO } from 'src/auth/dto/register-auth.dto';
import { PasswordHelper } from 'src/config/util/password.util';
import { Model } from 'mongoose';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(dto: RegisterAuthDTO) {
    if (dto.password == undefined) {
      throw new Error('Password required.');
    }
    const passwordGenerator = await PasswordHelper.hash(dto.password);

    const createUser = new this.userModel({
      ...dto,
      password_key: passwordGenerator.passKey,
    });

    try {
      return await createUser.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .select('+password_key')
      .exec();

    if (!user) {
      throw new NotFoundException('Could not find user.');
    }

    const isPasswordCorrect = await PasswordHelper.comparePassword(
      password,
      user.password_key,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new NotFoundException('Could not find user.');
    }

    return user;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('Could not find user.');
    }

    return user;
  }

  async update(id: string, updateUserDTO: UpdateUserDTO) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDTO, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Could not find user.');
    }

    return {
      message: 'User updated succesfully',
      data: updatedUser,
    };
  }
}
