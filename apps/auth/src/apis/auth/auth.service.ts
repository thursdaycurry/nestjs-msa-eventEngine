import { AuthRepository } from './auth.repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { comparePassword, hashPassword } from 'src/common/util/helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto) {
    const { email, password, name, loginType, role } = createUserDto;

    const foundUser = await this.authRepository.findByEmail(email);
    const isUserExist = !!foundUser;

    if (isUserExist) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const createUser = await this.authRepository.createUser({
      email,
      password: hashedPassword,
      name,
      loginType,
      role,
    });

    const result = {
      user: {
        userId: createUser.id,
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
    const isPasswordMatched: boolean = await comparePassword(
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

  private async generateAccessToken(payload): Promise<string> {
    return await this.jwtService.sign(payload);
  }

  async getUserLoginHistory(getUserLoginHistoryDto) {
    const userLoginHistory = await this.authRepository.getUserLoginHistory(
      getUserLoginHistoryDto,
    );

    return userLoginHistory;
  }

  async seedAuth() {
    const result = await this.authRepository.seedAuth();
    return result;
  }
}
