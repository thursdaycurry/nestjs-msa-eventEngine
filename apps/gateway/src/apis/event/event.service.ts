import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateRewardItemDto } from './dto/create-reward-item.dto';
import { CreateRewardDto } from './dto/create-reward.dto';

@Injectable()
export class EventService {
  constructor(@Inject('EVENT_SERVICE') private eventClient: ClientProxy) {}

  async createEvent(createEventDto: CreateEventDto) {
    const result = await firstValueFrom(
      this.eventClient.send({ cmd: 'createEvent' }, createEventDto),
    );
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
}
