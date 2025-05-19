import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/common/constants/constants';

export class UpdateUserRoleDto {
  @ApiProperty({
    example: '665a9f7eea43b80cbdf2e111',
    description: '_id of User',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'AUDITOR',
    description:
      'New user role to change to. Role should be in Capital letter. One of USER, OPERATOR, AUDITOR, ADMIN',
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  newRole: UserRole;
}
