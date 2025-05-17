import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  async signup(createUserDto: CreateUserDto) {
    const result = await firstValueFrom(this.authClient.send({ cmd: 'signup' }, createUserDto));
    return result;
  }

  async signin(signinUserDto: SigninUserDto) {
    const result = await firstValueFrom(this.authClient.send({ cmd: 'signin' }, signinUserDto));
    return result;
  }

  async getUser(userId: string) {
    const result = await firstValueFrom(this.authClient.send({ cmd: 'getUser' }, userId));
    return result;
  }

  async updateUserRole(updateUserRoleDto: UpdateUserRoleDto) {
    const result = await firstValueFrom(
      this.authClient.send({ cmd: 'updateUserRole' }, updateUserRoleDto),
    );
    return result;
  }
}
