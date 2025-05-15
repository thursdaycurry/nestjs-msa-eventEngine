import { AuthRepository } from './auth.repository';
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signup(createUserDto): Promise<User> {
    const { email, password, name, loginType } = createUserDto;

    const isUserExist = await this.authRepository.findByEmail(email);

    if (isUserExist) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const createUser = await this.authRepository.createUser({
      email,
      password: hashedPassword,
      name,
      loginType,
    });

    return createUser;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = 10;
    return bcrypt.hash(password, salt);
  }
}
