import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  EventCategory,
  EventStatusType,
  EventTriggerType,
} from 'src/common/constants/event';
import { Reward } from './reward.schema';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: EventCategory;

  @Prop({ required: true })
  triggerType: EventTriggerType;

  @Prop({ required: true })
  goal: number;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Reward', required: true })
  rewardId: Reward;

  @Prop({ required: true })
  status: EventStatusType;
}

export const EventSchema = SchemaFactory.createForClass(Event);
