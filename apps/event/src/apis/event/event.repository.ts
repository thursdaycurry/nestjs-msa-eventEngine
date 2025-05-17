import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RewardItem } from './schemas/rewardItem.schema';
import { Model } from 'mongoose';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(RewardItem.name)
    private readonly rewardItemModel: Model<RewardItem>,
  ) {}

  async createRewardItem(createRewardItemDto) {
    const { item, quantity } = createRewardItemDto;

    const rewardItem = new this.rewardItemModel({
      item,
      quantity,
    });

    return await rewardItem.save();
  }
}
