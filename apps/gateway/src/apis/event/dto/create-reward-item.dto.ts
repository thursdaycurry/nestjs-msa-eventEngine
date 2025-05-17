import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateRewardItemDto {
  @IsString()
  @IsNotEmpty()
  item: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
