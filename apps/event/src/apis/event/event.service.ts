import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { calcStatus, isTodayBetween } from 'src/common/util/helper';
import {
  ClaimStatus,
  EventCategory,
  EventStatusType,
  EventTriggerType,
} from 'src/common/constants/event';
import * as moment from 'moment';

import { EVENT_EVENT_TYPE } from 'src/common/constants/listener';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,

    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
  ) {}

  async claimReward(eventId: string, userId: string) {
    let finalClaimStatus: ClaimStatus;
    let message: string = '';

    try {
      const findEvent = await this.eventRepository.findEventById(eventId);

      // in case there is no such event
      if (!findEvent) {
        throw new NotAcceptableException('Event not found');
      }

      // in case reward already given
      const previousRewardLog = await this.eventRepository.findEventLog({
        eventType: EVENT_EVENT_TYPE.CLAIM_REWARD,
        eventId,
        userId,
        finalClaimStatus: ClaimStatus.SUCCESS,
      });
      const isRewardAlreadyGiven = !!previousRewardLog;
      if (isRewardAlreadyGiven) {
        throw new NotAcceptableException('Reward already given');
      }

      // in case trigger is not satisfied
      const isTriggerSatisfied = await this.calcTriggerSatisfied({
        category: findEvent.category, // ex) LOGIN
        triggerType: findEvent.triggerType, // ex) SINGLE, STREAK
        goal: findEvent.goal, // 7
        startDate: findEvent.startDate,
        endDate: findEvent.endDate,
        userId,
      });
      if (!isTriggerSatisfied) {
        throw new NotAcceptableException('Event trigger is not satisfied');
      }

      // in case event is off
      if (findEvent?.status === EventStatusType.OFF) {
        throw new NotAcceptableException('Event is deactivated');
      }

      // in case out of event period
      const isTodayInEventPeriod = isTodayBetween(
        findEvent?.startDate,
        findEvent?.endDate,
      );

      if (!isTodayInEventPeriod) {
        throw new NotAcceptableException('Event is not in progress');
      }

      finalClaimStatus = ClaimStatus.SUCCESS;
      message = 'Claim was successful';
    } catch (error) {
      finalClaimStatus = ClaimStatus.FAILURE;
      message = error?.message;
    }

    const claimResult = {
      eventId,
      userId,
      finalClaimStatus,
      message,
    };

    return claimResult;
  }

  async getEventRewardClaimHistory(eventId: string, userId: string) {
    const claimHistory = await this.eventRepository.findEventRewardClaimHistory(
      eventId,
      userId,
    );
    return claimHistory;
  }

  async searchEventRewardClaimHistory(claimHistoryDto) {
    const claimHistory =
      await this.eventRepository.findAllEventLog(claimHistoryDto);
    return claimHistory;
  }

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
    const foundEvent = await this.eventRepository.findEventById(eventId);
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
    const reward = await this.eventRepository.findRewardById(rewardId);
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

  async addRewardItemToReward(rewardId: string, rewardItemId: string) {
    const foundReward = await this.eventRepository.findRewardById(rewardId);
    if (!foundReward) {
      throw new Error('Reward not found');
    }

    const isDuplicatedRewardItem =
      foundReward.rewardItemIds.includes(rewardItemId);
    if (isDuplicatedRewardItem) {
      throw new Error('Reward already has this reward item');
    }

    foundReward.rewardItemIds.push(rewardItemId);

    const modifiedReward = await foundReward.save();

    return modifiedReward;
  }

  async calcTriggerSatisfied({
    userId,
    category,
    triggerType,
    goal,
    startDate,
    endDate,
  }: {
    userId: string;
    category: EventCategory;
    triggerType: EventTriggerType;
    goal: number;
    startDate: Date;
    endDate: Date;
  }) {
    let isTriggerSatisfied = false;

    switch (category) {
      case EventCategory.LOGIN:
        const userLoginHistory = await firstValueFrom(
          this.authClient.send(
            {
              cmd: 'getUserLoginHistory',
            },
            { userId, startDate, endDate },
          ),
        );

        const uniqueDayArr = Array.from(
          new Set(
            userLoginHistory.map((log) =>
              moment(log.createdAt).format('YYYY-MM-DD'),
            ),
          ),
        );

        const userLoginCount = uniqueDayArr.length;

        if (triggerType === EventTriggerType.SINGLE) {
          isTriggerSatisfied = userLoginCount > 0;
        }

        if (triggerType === EventTriggerType.STREAK) {
          isTriggerSatisfied = userLoginCount >= goal;
        }

      default:
        break;
    }

    return isTriggerSatisfied;
  }
}
