import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { calcStatus } from 'src/common/util/helper';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async createEvent(createEventDto) {
    const {
      category,
      title,
      description,
      startDate,
      endDate,
      triggerType,
      goal,
      rewardId,
    } = createEventDto;

    const status = calcStatus(startDate, endDate);

    const event = await this.eventRepository.createEvent({
      category,
      title,
      description,
      startDate,
      endDate,
      triggerType,
      goal,
      rewardId,
      status,
    });
    return event;
  }

  async createReward(createRewardDto) {
    const { title, description, rewardItemIds } = createRewardDto;

    const reward = await this.eventRepository.createReward({
      title,
      description,
      rewardItemIds,
    });

    return reward;
  }

  async createRewardItem(createRewardItemDto) {
    const rewardItem =
      await this.eventRepository.createRewardItem(createRewardItemDto);

    return rewardItem;
  }
}
