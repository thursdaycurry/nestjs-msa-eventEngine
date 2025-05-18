import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './apis/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ListenerModule } from './apis/listener/listener.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    AuthModule,
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
        port: 3001,
      },
    };
  }
}
