import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RewardItem } from './schemas/rewardItem.schema';
import mongoose, { Model } from 'mongoose';
import { Reward } from './schemas/reward.schema';
import { Event } from './schemas/event.schema';
import { EventLog } from './schemas/eventLog.schema';
import { EVENT_EVENT_TYPE } from 'src/common/constants/listener';
import {
  EventCategory,
  EventStatusType,
  EventTriggerType,
} from 'src/common/constants/event';

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
        path: 'rewardIds',
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

  async findEventLog(eventLogDto) {
    const eventLog = await this.eventLogModel.findOne(eventLogDto).exec();
    return eventLog;
  }

  async findAllEventLog(eventLogDto) {
    const eventLog = await this.eventLogModel.find(eventLogDto).exec();
    return eventLog;
  }

  async recordEventLog(eventLogDto) {
    const eventLog = new this.eventLogModel(eventLogDto);
    return await eventLog.save();
  }

  async findEventRewardClaimHistory(eventId: string, userId: string) {
    const userClaimData = await this.eventLogModel
      .find({
        eventType: EVENT_EVENT_TYPE.CLAIM_REWARD,
        eventId,
        userId,
      })
      .exec();
    return userClaimData;
  }

  // for testing
  async seedEvent() {
    // test data
    const idRewardItem1 = new mongoose.Types.ObjectId(
      '665a9f7eea43b80cbdf2e125',
    );
    const idRewardItem2 = new mongoose.Types.ObjectId(
      '665a9f7eea43b80cbdf2e126',
    );
    const idReward1 = new mongoose.Types.ObjectId('665a9f7eea43b80cbdf2e127');
    const idReward2 = new mongoose.Types.ObjectId('665a9f7eea43b80cbdf2e128');

    const idEvent1 = new mongoose.Types.ObjectId('665a9f7eea43b80cbdf2e129');
    const idEvent2 = new mongoose.Types.ObjectId('665a9f7eea43b80cbdf2e130');

    const rewardItems = [
      {
        _id: idRewardItem1,
        item: '포인트',
        quantity: 100,
      },
      {
        _id: idRewardItem2,
        item: '국화꽃',
        quantity: 7,
      },
    ];

    const rewards = [
      {
        _id: idReward1,
        title: '포인트 100 보상',
        description: '달성 시 포인트 100점을 보상으로 제공하는 보상입니다.',
        rewardItemIds: [idRewardItem1],
      },
      {
        _id: idReward2,
        title: '추모의 국화꽃 보상',
        description: '달성 시 국화꽃 7개를 보상으로 제공하는 보상입니다.',
        rewardItemIds: [idRewardItem2],
      },
    ];

    const events = [
      {
        _id: idEvent1,
        title: '생애 첫 7일 연속 로그인 달성 이벤트',
        description:
          '생애 첫 7일 연속 로그인을 달성하면 포인트 100점을 보상으로 제공하는 이벤트입니다.',
        category: EventCategory.LOGIN,
        status: EventStatusType.ON,
        triggerType: EventTriggerType.STREAK,
        goal: 7,
        startDate: new Date('2025-05-10T00:00:00.000Z'),
        endDate: new Date('2025-05-30T23:59:59.999Z'),
        rewardIds: [idReward1],
      },
      {
        _id: idEvent2,
        title: '현충일 로그인 이벤트',
        description:
          '당일 로그인 하면 국화꽃 7개를 보상으로 제공하는 이벤트입니다.',
        category: EventCategory.LOGIN,
        status: EventStatusType.OFF,
        triggerType: EventTriggerType.SINGLE,
        goal: 1,
        startDate: new Date('2025-06-06T00:00:00.000Z'),
        endDate: new Date('2025-06-06T23:59:59.999Z'),
        rewardIds: [idReward2],
      },
    ];

    const createdRewardItems =
      await this.rewardItemModel.insertMany(rewardItems);
    const createdRewards = await this.rewardModel.insertMany(rewards);
    const createdEvents = await this.eventModel.insertMany(events);

    const result = {
      createdRewardItems,
      createdRewards,
      createdEvents,
    };

    return result;
  }
}
