import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardItem, RewardItemSchema } from './schemas/rewardItem.schema';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { Event, EventSchema } from './schemas/event.schema';
import { EventLog, EventLogSchema } from './schemas/eventLog.schema';
import { ClientsModule } from 'src/common/clients/clients.module';

@Module({
  imports: [
    ClientsModule,
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardItem.name, schema: RewardItemSchema },
      {
        name: EventLog.name,
        schema: EventLogSchema,
      },
    ]),
  ],
  providers: [EventService, EventRepository],
  exports: [EventService, EventRepository],
})
export class EventModule {}
