import { IsArray, IsDateString, IsEnum, IsInt, IsString, Min } from 'class-validator';
import { EventCategory, EventTriggerType } from 'src/common/constants/constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    example: '일주일 쭈욱 포인트 팡팡',
    description: 'Event title',
  })
  @IsString()
  title: string; // '7일 연속 로그인 이벤트'

  @ApiProperty({
    example: '7일 연속 로그인 시 보상하는 이벤트입니다',
    description: 'Event description',
  })
  @IsString()
  description: string; // '7일 연속 로그인 시 보상'

  @ApiProperty({
    example: 'LOGIN',
    description: 'Event category',
  })
  @IsEnum(EventCategory)
  category: EventCategory; // 'LOGIN', 'FRIEND_INVITE', 'PURCHASE'

  @ApiProperty({
    example: 'STREAK',
    description: 'Event trigger type',
  })
  @IsEnum(EventTriggerType)
  triggerType: EventTriggerType;

  @ApiProperty({
    example: 7,
    description: 'unit number of goal. e.g. 7일 연속 로그인 이벤트라면 goal은 7',
  })
  @IsInt()
  @Min(1)
  goal: number; // 7일

  @ApiProperty({
    example: '2024-06-01',
    description: 'Event start date',
  })
  @IsDateString()
  startDate: Date; // '2024-06-01'

  @ApiProperty({
    example: '2024-07-30',
    description: 'Event end date',
  })
  @IsDateString()
  endDate: Date; // '2024-07-30'

  @ApiProperty({
    example: ['665a9f7eea43b80cbdf2e127'],
    description: '_id of rewards',
  })
  @IsArray()
  @IsString({ each: true })
  rewardIds: string[]; // 보상
}
