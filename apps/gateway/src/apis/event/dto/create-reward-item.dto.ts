import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateRewardItemDto {
  @ApiProperty({
    example: '포인트',
    description: 'Reward item name',
  })
  @IsString()
  @IsNotEmpty()
  item: string;

  @ApiProperty({
    example: 100,
    description: 'unit of Reward item in quantity',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
