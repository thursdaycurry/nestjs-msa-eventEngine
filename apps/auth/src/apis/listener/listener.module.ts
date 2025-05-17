import { Module } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [EventEmitterModule, AuthModule],
  providers: [ListenerService],
})
export class ListenerModule {}
