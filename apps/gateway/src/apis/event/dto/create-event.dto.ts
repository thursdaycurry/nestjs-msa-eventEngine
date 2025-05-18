import { IsArray, IsDateString, IsEnum, IsInt, IsString, Min } from 'class-validator';
import { EventCategory, EventTriggerType } from 'src/common/constants/constants';

export class CreateEventDto {
  @IsString()
  title: string; // '7일 연속 로그인 이벤트'

  @IsString()
  description: string; // '7일 연속 로그인 시 보상'

  @IsEnum(EventCategory)
  category: EventCategory; // 'LOGIN', 'FRIEND_INVITE', 'PURCHASE'

  @IsEnum(EventTriggerType)
  triggerType: EventTriggerType;

  @IsInt()
  @Min(1)
  goal: number; // 7일

  @IsDateString()
  startDate: Date; // '2024-06-01'

  @IsDateString()
  endDate: Date; // '2024-07-30'

  @IsArray()
  @IsString({ each: true })
  rewardIds: string[]; // 보상
}
