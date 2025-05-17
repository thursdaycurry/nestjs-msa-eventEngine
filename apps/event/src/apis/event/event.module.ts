import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardItem, RewardItemSchema } from './schemas/rewardItem.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardItem.name, schema: RewardItemSchema },
    ]),
  ],
  providers: [EventService, EventRepository],
  exports: [EventService, EventRepository],
})
export class EventModule {}
