import { Module } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from '../event/event.module';

@Module({
  imports: [EventEmitterModule, EventModule],
  providers: [ListenerService],
})
export class ListenerModule {}
