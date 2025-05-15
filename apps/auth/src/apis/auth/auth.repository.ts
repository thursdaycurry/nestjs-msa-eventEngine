import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async createUser(createUserDto): Promise<User> {
    const { email, password, name, loginType } = createUserDto;

    const createdUser = new this.userModel({
      email,
      password,
      name,
      loginType,
    });

    return createdUser.save();
  }
}
