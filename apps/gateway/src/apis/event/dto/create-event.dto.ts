import { IsNumber, IsString } from 'class-validator';
import { EventCategory } from 'src/common/constants/constants';

export class CreateEventDto {
  @IsString()
  category: EventCategory; // 'LOGIN', 'FRIEND_INVITE', 'PURCHASE'

  @IsString()
  title: string; // '7일 연속 로그인 이벤트'

  @IsString()
  description: string; // '7일 연속 로그인 시 보상'

  @IsString()
  startDate: Date; // '2024-06-01'

  @IsString()
  endDate: Date; // '2024-07-30'

  @IsNumber()
  goal: number; // 7일

  @IsString()
  rewardId: string; // 보상
}
