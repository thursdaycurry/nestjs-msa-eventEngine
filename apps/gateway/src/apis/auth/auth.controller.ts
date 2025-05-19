import { Body, Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/constants/constants';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User 회원가입',
    description:
      '회원가입을 위한 api입니다. 이메일, 비밀번호, 이름, 로그인(credentials) 타입으로 사용자를 등록합니다.',
  })
  @ApiBody({ type: CreateUserDto })
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @ApiOperation({
    summary: 'Admin 회원가입',
    description:
      'Admin 전용 회원가입 api입니다. 테스트 편의를 위한 api로 프로덕션 환경에서는 사용하지 않습니다.',
  })
  @ApiBody({ type: CreateAdminDto })
  @Post('signup/admin')
  async signupAdmin(@Body() createAdminDto: CreateAdminDto) {
    return await this.authService.signup(createAdminDto);
  }

  @ApiOperation({
    summary: 'User 로그인',
    description:
      '🚨🚨🚨 필수 bearer 토큰 설정: 로그인 후 발급되는 access token을 현재 페이지 상단의 Authorize 입력창에 반드시 기입해주세요!! - 로그인을 위한 api입니다. 로그인 후 반환되는 id, token을 복사하여 아래 API 호출에 사용해주세요.',
  })
  @ApiBody({ type: SigninUserDto })
  @Post('signin')
  async signin(@Body() signinUserDto: SigninUserDto) {
    return await this.authService.signin(signinUserDto);
  }

  // ADMIN
  @ApiOperation({
    summary: 'User 정보 조회',
    description: 'ADMIN이 특정 user 정보를 조회하는 api입니다.',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'User id',
    example: '665a9f7eea43b80cbdf2e111',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('user/:userId')
  async getUser(@Param('userId') userId: string) {
    return await this.authService.getUser(userId);
  }

  @ApiOperation({
    summary: 'User Role 수정',
    description: 'ADMIN이 특정 유저의 role을 수정하는 api입니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('user/role')
  async updateUserRole(@Body() updateRoleDto: UpdateUserRoleDto) {
    return await this.authService.updateUserRole(updateRoleDto);
  }
}
