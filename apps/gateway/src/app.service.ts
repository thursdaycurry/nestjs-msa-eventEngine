import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('EVENT_SERVICE') private eventClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello from gateway server with port number 3000';
  }

  async healthCheck(): Promise<{ auth: any; event: any }> {
    try {
      const [authHealth, eventHealth] = await Promise.all([
        firstValueFrom(this.authClient.send({ cmd: 'health' }, {})),
        firstValueFrom(this.eventClient.send({ cmd: 'health' }, {})),
      ]);

      return {
        auth: authHealth,
        event: eventHealth,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Health check failed: ${error.message}`);
    }
  }

  async seed() {
    try {
      const [authSeed, eventSeed] = await Promise.all([
        firstValueFrom(this.authClient.send({ cmd: 'seedAuth' }, {})),
        firstValueFrom(this.eventClient.send({ cmd: 'seedEvent' }, {})),
      ]);

      return {
        auth: authSeed,
        event: eventSeed,
      };
    } catch (error) {
      throw new InternalServerErrorException(`Seed failed: ${error.message}`);
    }
  }
}
