import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RewardItem } from './schemas/rewardItem.schema';
import { Model } from 'mongoose';
import { Reward } from './schemas/reward.schema';
import { Event } from './schemas/event.schema';
import { EventLog } from './schemas/eventLog.schema';
import { EVENT_EVENT_TYPE } from 'src/common/constants/listener';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<Reward>,
    @InjectModel(RewardItem.name)
    private readonly rewardItemModel: Model<RewardItem>,
    @InjectModel(EventLog.name)
    private readonly eventLogModel: Model<EventLog>,
  ) {}

  async findEventById(eventId: string) {
    const event = await this.eventModel.findById(eventId).exec();
    return event;
  }

  async getEventList() {
    const eventList = await this.eventModel.find().exec();
    return eventList;
  }

  async getEventDetail(eventId: string) {
    const eventDetail = await this.eventModel
      .findById(eventId)
      .populate({
        path: 'rewardId',
        populate: {
          path: 'rewardItemIds',
          populate: {
            path: 'item',
          },
        },
      })
      .exec();
    return eventDetail;
  }

  async createEvent(createEventDto) {
    const event = new this.eventModel(createEventDto);

    return await event.save();
  }

  async findRewardById(rewardId: string) {
    const reward = await this.rewardModel.findById(rewardId).exec();
    return reward;
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

  async recordEventLog(eventLogDto) {
    const eventLog = new this.eventLogModel(eventLogDto);
    return await eventLog.save();
  }

  async findEventLog(eventLogDto) {
    const eventLog = await this.eventLogModel.findOne(eventLogDto).exec();
    return eventLog;
  }
}
