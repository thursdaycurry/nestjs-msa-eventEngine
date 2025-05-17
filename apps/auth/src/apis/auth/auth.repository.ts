import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { AuthEvent } from './schemas/authevent.schema';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(AuthEvent.name)
    private readonly authEventModel: Model<AuthEvent>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
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

  async updateUserRole(userId: string, newRole: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(userId, { role: newRole });
  }

  async recordAuthEvent(authEventDto) {
    const createdAuthEvent = new this.authEventModel(authEventDto);
    return createdAuthEvent.save();
  }
}
