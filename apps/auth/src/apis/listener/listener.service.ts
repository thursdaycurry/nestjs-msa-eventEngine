import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AUTH_EVENT_TYPE } from 'src/common/constants/listener';
import { AuthRepository } from '../auth/auth.repository';

@Injectable()
export class ListenerService {
  constructor(private readonly authRepository: AuthRepository) {}
  private readonly logger = new Logger(ListenerService.name);

  @OnEvent(AUTH_EVENT_TYPE.USER_SIGNIN)
  async recordSigninHistory(payload: { userId: string }) {
    const authEventDto = {
      eventType: AUTH_EVENT_TYPE.USER_SIGNIN,
      userId: payload.userId,
    };
    await this.authRepository.recordAuthLog(authEventDto);

    this.logger.log(`user signed in`, payload);
  }
}
