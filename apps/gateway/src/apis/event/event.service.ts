import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateRewardItemDto } from './dto/create-reward-item.dto';
import { CreateRewardDto } from './dto/create-reward.dto';

@Injectable()
export class EventService {
  constructor(@Inject('EVENT_SERVICE') private eventClient: ClientProxy) {}

  async getEventList() {
    const result = await firstValueFrom(this.eventClient.send({ cmd: 'getEventList' }, {}));
    return result;
  }

  async getEventDetail(eventId: string) {
    const result = await firstValueFrom(this.eventClient.send({ cmd: 'getEventDetail' }, eventId));
    return result;
  }

  async createEvent(createEventDto: CreateEventDto) {
    const result = await firstValueFrom(
      this.eventClient.send({ cmd: 'createEvent' }, createEventDto),
    );
    return result;
  }

  async addRewardToEvent(eventId: string, rewardId: string) {
    const result = await firstValueFrom(
      this.eventClient.send({ cmd: 'addRewardToEvent' }, { eventId, rewardId }),
    );
    return result;
  }

  async getReward(rewardId: string) {
    const result = await firstValueFrom(this.eventClient.send({ cmd: 'getReward' }, rewardId));
    return result;
  }

  async createReward(createRewardDto: CreateRewardDto) {
    const result = await firstValueFrom(
      this.eventClient.send({ cmd: 'createReward' }, createRewardDto),
    );
    return result;
  }

  async createRewardItem(createRewardItemDto: CreateRewardItemDto) {
    const result = await firstValueFrom(
      this.eventClient.send({ cmd: 'createRewardItem' }, createRewardItemDto),
    );
    return result;
  }

  async addRewardItemToReward(rewardId: string, rewardItemId: string) {
    const result = await firstValueFrom(
      this.eventClient.send({ cmd: 'addRewardItemToReward' }, { rewardId, rewardItemId }),
    );
    return result;
  }
}
