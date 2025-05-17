import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { EventService } from './apis/event/event.service';

@Controller()
export class AppController {
  constructor(
    private readonly eventService: EventService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  // @MessagePattern({ cmd: 'createEvent' })
  // async createEvent(createEventDto) {
  //   const result = await this.eventService.createEvent(createEventDto);
  //   return result;
  // }

  // @MessagePattern({ cmd: 'createReward' })
  // async createReward(createRewardDto) {
  //   const result = await this.eventService.createReward(createRewardDto);
  //   return result;
  // }

  //TODO: add role check
  @MessagePattern({ cmd: 'createRewardItem' })
  async createRewardItem(createRewardItemDto) {
    const result =
      await this.eventService.createRewardItem(createRewardItemDto);
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
      service: 'event',
      dbStatus,
    };
  }
}
