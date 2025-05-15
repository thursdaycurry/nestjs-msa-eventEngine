import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.userService.signup(createUserDto);
  }

  @Post('signin')
  async signin(@Body() signinUserDto: SigninUserDto) {
    return await this.userService.signin(signinUserDto);
  }

  @Post('protected')
  @UseGuards(JwtAuthGuard)
  protected() {
    return 'protected';
  }
}
