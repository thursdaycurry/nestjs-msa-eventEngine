import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/common/constants/constants';

export class CreateAdminDto {
  @ApiProperty({
    example: 'admin2@milkyway.com',
    description: 'admin user email',
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
    example: 'another susan',
    description: 'just admin name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'credentials',
    description: 'User login type',
  })
  @IsNotEmpty()
  loginType: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'User role',
  })
  @IsNotEmpty()
  role: string = UserRole.ADMIN;
}
