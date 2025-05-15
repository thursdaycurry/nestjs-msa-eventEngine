import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  async signup(createUserDto) {
    const result = await firstValueFrom(this.authClient.send({ cmd: 'signup' }, createUserDto));
    return result;
  }

  async signin(signinUserDto) {
    const result = await firstValueFrom(this.authClient.send({ cmd: 'signin' }, signinUserDto));
    return result;
  }
}
