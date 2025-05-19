import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthService } from './apis/auth/auth.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AUTH_EVENT_TYPE } from './common/constants/listener';

@Controller()
export class AppController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @MessagePattern({ cmd: 'signup' })
  async signup(createUserDto) {
    const result = await this.authService.signup(createUserDto);
    return result;
  }

  @MessagePattern({ cmd: 'signin' })
  async signin(signinUserDto) {
    const result = await this.authService.signin(signinUserDto);

    const { user } = result;
    this.eventEmitter.emit(AUTH_EVENT_TYPE.USER_SIGNIN, {
      userId: user?.userId,
    });
    return result;
  }

  @MessagePattern({ cmd: 'getUser' })
  async getUser(userId) {
    const result = await this.authService.getUser(userId);
    return result;
  }

  @MessagePattern({ cmd: 'updateUserRole' })
  async updateUserRole(updateUserRoleDto) {
    const result = await this.authService.updateUserRole(updateUserRoleDto);
    return result;
  }

  @MessagePattern({ cmd: 'health' })
  healthCheck() {
    const mongoStatus = this.connection.readyState;

    const MONGO_STATUS_DICT = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const dbStatus: string = MONGO_STATUS_DICT[mongoStatus] ?? 'unknown';

    return {
      status: 'ok',
      service: 'auth',
      dbStatus,
    };
  }

  @MessagePattern({ cmd: 'getUserLoginHistory' })
  async getUserLoginHistory(getUserLoginHistoryDto) {
    const result = await this.authService.getUserLoginHistory(
      getUserLoginHistoryDto,
    );
    return result;
  }

  @MessagePattern({ cmd: 'seedAuth' })
  async seedAuth() {
    const result = await this.authService.seedAuth();
    return result;
  }
}
