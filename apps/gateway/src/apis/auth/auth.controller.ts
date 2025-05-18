import { Body, Controller, Get, Post, Param, UseGuards } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/constants/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // PUBLIC
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @Post('signin')
  async signin(@Body() signinUserDto: SigninUserDto) {
    return await this.authService.signin(signinUserDto);
  }

  // ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('user/:userId')
  async getUser(@Param('userId') userId: string) {
    return await this.authService.getUser(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('user/role')
  async updateUserRole(@Body() updateRoleDto: UpdateUserRoleDto) {
    return await this.authService.updateUserRole(updateRoleDto);
  }
}
