import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateRewardDto {
  @ApiProperty({
    example: '100포인트 보상',
    description: 'Reward title, not item. Reward can includes multiple items',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: '달성 시 100포인트 주는 보상입니다.',
    description: 'Reward description',
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: ['665a9f7eea43b80cbdf2e125'],
    description: '_id of reward item',
  })
  @IsArray()
  readonly rewardItemIds: string[];
}
