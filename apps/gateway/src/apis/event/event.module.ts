import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { ClientsModule } from 'src/common/clients/clients.module';

@Module({
  imports: [ClientsModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
