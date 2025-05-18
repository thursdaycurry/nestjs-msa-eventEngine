import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ClientsModule,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './apis/event/event.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ListenerModule } from './apis/listener/listener.module';

@Module({
  imports: [
    // for importing microservices
    ClientsModule,

    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    EventModule,
    EventEmitterModule.forRoot({
      wildcard: false,
    }),
    EventEmitterModule,
    ListenerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static register(): MicroserviceOptions {
    return {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3002,
      },
    };
  }
}
