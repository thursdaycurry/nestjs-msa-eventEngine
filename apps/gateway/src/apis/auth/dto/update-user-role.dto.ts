import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/common/constants/constants';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  newRole: UserRole;
}
