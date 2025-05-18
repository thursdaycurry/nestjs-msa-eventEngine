import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { calcStatus } from 'src/common/util/helper';
import { async } from 'rxjs';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async getEventList() {
    const eventList = await this.eventRepository.getEventList();
    return eventList;
  }

  async getEventDetail(eventId: string) {
    const eventDetail = await this.eventRepository.getEventDetail(eventId);
    return eventDetail;
  }

  async createEvent(createEventDto) {
    const {
      category,
      title,
      description,
      startDate,
      endDate,
      triggerType,
      goal,
      rewardIds,
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
      rewardIds,
      status,
    });
    return event;
  }

  async addRewardToEvent(eventId: string, rewardId: string) {
    const foundEvent = await this.eventRepository.findById(eventId);
    if (!foundEvent) {
      throw new Error('Event not found');
    }

    const isDuplicatedReward = foundEvent.rewardIds.includes(rewardId);
    if (isDuplicatedReward) {
      throw new Error('Event already has this reward');
    }

    foundEvent.rewardIds.push(rewardId);

    const modifiedEvent = await foundEvent.save();

    return modifiedEvent;
  }

  async getReward(rewardId: string) {
    const reward = await this.eventRepository.getReward(rewardId);
    return reward;
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
