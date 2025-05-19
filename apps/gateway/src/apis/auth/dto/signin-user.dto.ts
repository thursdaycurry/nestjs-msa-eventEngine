import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninUserDto {
  @ApiProperty({
    example: 'admin@milkyway.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'mypassword',
    description: 'User password',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'credentials',
    description: 'User login type',
  })
  @IsNotEmpty()
  loginType: string;
}
