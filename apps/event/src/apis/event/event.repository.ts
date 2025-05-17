import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RewardItem } from './schemas/rewardItem.schema';
import { Model } from 'mongoose';
import { Reward } from './schemas/reward.schema';
import { Event } from './schemas/event.schema';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<Reward>,
    @InjectModel(RewardItem.name)
    private readonly rewardItemModel: Model<RewardItem>,
  ) {}

  async createEvent(createEventDto) {
    const event = new this.eventModel(createEventDto);

    return await event.save();
  }

  async createReward(createRewardDto) {
    const reward = new this.rewardModel(createRewardDto);

    return await reward.save();
  }

  async createRewardItem(createRewardItemDto) {
    const { item, quantity } = createRewardItemDto;

    const rewardItem = new this.rewardItemModel({
      item,
      quantity,
    });

    return await rewardItem.save();
  }
}
