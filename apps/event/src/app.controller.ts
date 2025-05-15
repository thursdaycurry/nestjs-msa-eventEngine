import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

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
      service: 'event',
      dbStatus,
    };
  }
}
