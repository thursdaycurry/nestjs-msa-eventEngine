import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsArray()
  readonly rewardItemIds: string[];
}
