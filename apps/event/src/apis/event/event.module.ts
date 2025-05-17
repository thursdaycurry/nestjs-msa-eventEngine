import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardItem, RewardItemSchema } from './schemas/rewardItem.schema';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { Event, EventSchema } from './schemas/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardItem.name, schema: RewardItemSchema },
    ]),
  ],
  providers: [EventService, EventRepository],
  exports: [EventService, EventRepository],
})
export class EventModule {}
