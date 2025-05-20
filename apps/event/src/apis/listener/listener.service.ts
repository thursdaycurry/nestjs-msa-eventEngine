import { Injectable, Logger } from '@nestjs/common';
import { EventRepository } from '../event/event.repository';
import { EVENT_EVENT_TYPE } from 'src/common/constants/listener';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ListenerService {
  constructor(private readonly eventRepository: EventRepository) {}
  private readonly logger = new Logger(ListenerService.name);

  @OnEvent(EVENT_EVENT_TYPE.CLAIM_REWARD)
  async recordClaimRewardHistory(payload: {
    eventId: string;
    userId: string;
    finalClaimStatus: string;
    message: string;
  }) {
    const eventLogDto = {
      eventType: EVENT_EVENT_TYPE.CLAIM_REWARD,
      ...payload,
    };

    await this.eventRepository.recordEventLog(eventLogDto);

    this.logger.log(`claim reward`, eventLogDto);
  }
}
