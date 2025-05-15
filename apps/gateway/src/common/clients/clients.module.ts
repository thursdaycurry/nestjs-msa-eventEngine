// apps/gateway/src/apis/clients/clients.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule as NestClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    NestClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth',
          port: 3001,
        },
      },
      {
        name: 'EVENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'event',
          port: 3002,
        },
      },
    ]),
  ],
  exports: [NestClientsModule],
})
export class ClientsModule {}
