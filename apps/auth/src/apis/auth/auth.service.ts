import { AuthRepository } from './auth.repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto) {
    const { email, password, name, loginType } = createUserDto;

    const foundUser = await this.authRepository.findByEmail(email);
    const isUserExist = !!foundUser;

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

    const result = {
      user: {
        email: createUser.email,
        name: createUser.name,
        role: createUser.role,
      },
    };

    return result;
  }

  async signin(signinUserDto) {
    const { email, password, loginType } = signinUserDto;

    const foundUser: User | null = await this.authRepository.findByEmail(email);

    // User validation
    const isUserExist: boolean = !!foundUser;
    const isPasswordMatched: boolean = await this.comparePassword(
      password as string,
      foundUser?.password as string,
    );

    let processCode: string | null = '';

    if (!isUserExist) {
      processCode = 'USER_NOT_FOUND';
      throw new NotFoundException(processCode);
    } else if (!isPasswordMatched) {
      processCode = 'PASSWORD_NOT_MATCHED';
      throw new BadRequestException(processCode);
    } else {
      processCode = 'SUCCESS';
    }

    if (processCode !== 'SUCCESS') {
      throw new Error(processCode);
    }

    // JWT

    const coreUserInfo = {
      userId: foundUser?.id,
      name: foundUser?.name,
      email: foundUser?.email,
      role: foundUser?.role,
    };

    const payload = {
      sub: foundUser?.id,
      ...coreUserInfo,
    };
    const access_token: string = await this.generateAccessToken(payload);

    return {
      access_token,
      user: coreUserInfo,
    };
  }

  async getUser(userId) {
    const foundUser = await this.authRepository.findById(userId);
    const isUserExist: boolean = !!foundUser;

    if (!isUserExist) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const result = {
      user: {
        name: foundUser?.name,
        email: foundUser?.email,
        role: foundUser?.role,
      },
    };

    return result;
  }

  async updateUserRole(updateUserRoleDto) {
    const { userId, newRole } = updateUserRoleDto;

    const foundUser = await this.authRepository.findById(userId);
    const isUserExist: boolean = !!foundUser;

    if (!isUserExist) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const updatedUser: User | null = await this.authRepository.updateUserRole(
      userId,
      newRole,
    );

    const result = {
      user: {
        name: updatedUser?.name,
        email: updatedUser?.email,
        prevRole: updatedUser?.role,
        newRole,
      },
    };

    return result;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private async generateAccessToken(payload): Promise<string> {
    return this.jwtService.sign(payload);
  }
}
