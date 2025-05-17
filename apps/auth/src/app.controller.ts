import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthService } from './apis/auth/auth.service';
import { User } from './apis/auth/schemas/user.schema';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern({ cmd: 'signup' })
  async signup(createUserDto) {
    const result = await this.authService.signup(createUserDto);
    return result;
  }

  @MessagePattern({ cmd: 'signin' })
  async signin(signinUserDto) {
    const result = await this.authService.signin(signinUserDto);
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
}
