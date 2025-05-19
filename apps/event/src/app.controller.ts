import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { EventService } from './apis/event/event.service';
import { EVENT_EVENT_TYPE } from './common/constants/listener';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class AppController {
  constructor(
    private readonly eventService: EventService,
    @InjectConnection() private readonly connection: Connection,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @MessagePattern({ cmd: 'claimReward' })
  async claimReward({ eventId, userId }: { eventId: string; userId: string }) {
    const claimResult = await this.eventService.claimReward(eventId, userId);
    this.eventEmitter.emit(EVENT_EVENT_TYPE.CLAIM_REWARD, claimResult);

    return claimResult;
  }

  @MessagePattern({ cmd: 'getEventRewardClaimHistory' })
  async getEventRewardClaimHistory({
    eventId,
    userId,
  }: {
    eventId: string;
    userId: string;
  }) {
    const result = await this.eventService.getEventRewardClaimHistory(
      eventId,
      userId,
    );
    return result;
  }

  @MessagePattern({ cmd: 'searchEventRewardClaimHistory' })
  async searchEventRewardClaimHistory(claimHistoryDto) {
    const result =
      await this.eventService.searchEventRewardClaimHistory(claimHistoryDto);
    return result;
  }

  @MessagePattern({ cmd: 'getEventList' })
  async getEventList() {
    const result = await this.eventService.getEventList();
    return result;
  }

  @MessagePattern({ cmd: 'getEventDetail' })
  async getEventDetail(eventId: string) {
    const result = await this.eventService.getEventDetail(eventId);
    return result;
  }

  @MessagePattern({ cmd: 'createEvent' })
  async createEvent(createEventDto) {
    const result = await this.eventService.createEvent(createEventDto);
    return result;
  }

  @MessagePattern({ cmd: 'addRewardToEvent' })
  async addRewardToEvent({
    eventId,
    rewardId,
  }: {
    eventId: string;
    rewardId: string;
  }) {
    const result = await this.eventService.addRewardToEvent(eventId, rewardId);
    return result;
  }

  @MessagePattern({ cmd: 'getReward' })
  async getReward(rewardId: string) {
    const result = await this.eventService.getReward(rewardId);
    return result;
  }

  @MessagePattern({ cmd: 'createReward' })
  async createReward(createRewardDto) {
    const result = await this.eventService.createReward(createRewardDto);
    return result;
  }

  @MessagePattern({ cmd: 'createRewardItem' })
  async createRewardItem(createRewardItemDto) {
    const result =
      await this.eventService.createRewardItem(createRewardItemDto);
    return result;
  }

  @MessagePattern({ cmd: 'addRewardItemToReward' })
  async addRewardItemToReward({
    rewardId,
    rewardItemId,
  }: {
    rewardId: string;
    rewardItemId: string;
  }) {
    const result = await this.eventService.addRewardItemToReward(
      rewardId,
      rewardItemId,
    );
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

  @MessagePattern({ cmd: 'seedEvent' })
  async seedEvent() {
    const result = await this.eventService.seedEvent();
    return result;
  }

  
}
