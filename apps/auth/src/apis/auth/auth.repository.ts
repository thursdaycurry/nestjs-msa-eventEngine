import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { AuthEvent } from './schemas/authevent.schema';
import { AUTH_EVENT_TYPE } from 'src/common/constants/listener';
import { hashPassword } from 'src/common/util/helper';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(AuthEvent.name)
    private readonly authEventModel: Model<AuthEvent>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async createUser(createUserDto): Promise<User> {
    const { email, password, name, loginType, role } = createUserDto;

    const createdUser = new this.userModel({
      email,
      password,
      name,
      loginType,
      role,
    });

    return createdUser.save();
  }

  async updateUserRole(userId: string, newRole: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(userId, { role: newRole });
  }

  async getUserLoginHistory(getUserLoginHistoryDto) {
    const { userId, startDate, endDate } = getUserLoginHistoryDto;

    const userLoginHistory = await this.authEventModel.find({
      userId,
      eventType: AUTH_EVENT_TYPE.USER_SIGNIN,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    return userLoginHistory;
  }

  async recordAuthLog(authEventDto) {
    const createdAuthEvent = new this.authEventModel(authEventDto);
    return createdAuthEvent.save();
  }

  // for test
  async seedAuth() {
    const idUser = new mongoose.Types.ObjectId('665a9f7eea43b80cbdf2e111');
    const idOperator = new mongoose.Types.ObjectId('665a9f7eea43b80cbdf2e112');
    const idAuditor = new mongoose.Types.ObjectId('665a9f7eea43b80cbdf2e113');
    const idAdmin = new mongoose.Types.ObjectId('665a9f7eea43b80cbdf2e114');

    const hashedPassword = await hashPassword('mypassword');

    const users = [
      {
        _id: idUser,
        email: 'user@milkyway.com',
        name: 'john',
        password: hashedPassword,
        loginType: 'credentials',
        role: 'USER',
      },
      {
        _id: idOperator,
        email: 'operator@milkyway.com',
        name: 'susan',
        password: hashedPassword,
        loginType: 'credentials',
        role: 'OPERATOR',
      },
      {
        _id: idAuditor,
        email: 'auditor@milkyway.com',
        name: 'roy',
        password: hashedPassword,
        loginType: 'credentials',
        role: 'AUDITOR',
      },
      {
        _id: idAdmin,
        email: 'admin@milkyway.com',
        name: 'dio',
        password: hashedPassword,
        loginType: 'credentials',
        role: 'ADMIN',
      },
    ];

    const createdUsers = await this.userModel.insertMany(users);

    const result_users = [
      {
        _id: idUser,
        email: 'user@milkyway.com',
        name: 'john',
        password: 'mypassword',
        loginType: 'credentials',
        role: 'USER',
      },
      {
        _id: idOperator,
        email: 'operator@milkyway.com',
        name: 'susan',
        password: 'mypassword',
        loginType: 'credentials',
        role: 'OPERATOR',
      },
      {
        _id: idAuditor,
        email: 'auditor@milkyway.com',
        name: 'roy',
        password: 'mypassword',
        loginType: 'credentials',
        role: 'AUDITOR',
      },
      {
        _id: idAdmin,
        email: 'admin@milkyway.com',
        name: 'dio',
        password: 'mypassword',
        loginType: 'credentials',
        role: 'ADMIN',
      },
    ];

    const resultAuthEvents = [
      {
        userId: idUser,
        eventType: AUTH_EVENT_TYPE.USER_SIGNIN,
        createdAt: new Date('2025-05-10T12:00:00.000Z'),
      },
      {
        userId: idUser,
        eventType: AUTH_EVENT_TYPE.USER_SIGNIN,
        createdAt: new Date('2025-05-11T12:00:00.000Z'),
      },
      {
        userId: idUser,
        eventType: AUTH_EVENT_TYPE.USER_SIGNIN,
        createdAt: new Date('2025-05-12T12:00:00.000Z'),
      },
      {
        userId: idUser,
        eventType: AUTH_EVENT_TYPE.USER_SIGNIN,
        createdAt: new Date('2025-05-13T12:00:00.000Z'),
      },
      {
        userId: idUser,
        eventType: AUTH_EVENT_TYPE.USER_SIGNIN,
        createdAt: new Date('2025-05-14T12:00:00.000Z'),
      },
      {
        userId: idUser,
        eventType: AUTH_EVENT_TYPE.USER_SIGNIN,
        createdAt: new Date('2025-05-15T12:00:00.000Z'),
      },
      {
        userId: idUser,
        eventType: AUTH_EVENT_TYPE.USER_SIGNIN,
        createdAt: new Date('2025-05-16T12:00:00.000Z'),
      },
      {
        userId: idUser,
        eventType: AUTH_EVENT_TYPE.USER_SIGNIN,
        createdAt: new Date('2025-05-17T12:00:00.000Z'),
      },
      {
        userId: idUser,
        eventType: AUTH_EVENT_TYPE.USER_SIGNIN,
        createdAt: new Date('2025-05-18T12:00:00.000Z'),
      },
      {
        userId: idUser,
        eventType: AUTH_EVENT_TYPE.USER_SIGNIN,
        createdAt: new Date('2025-05-19T12:00:00.000Z'),
      },
    ];

    const result_authEvents =
      await this.authEventModel.insertMany(resultAuthEvents);

    const result = {
      createdUsers: result_users,
      createdAuthEvents: result_authEvents,
    };
    return result;
  }
}
