import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { RewardItem } from './rewardItem.schema';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Reward extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'RewardItem',
    required: true,
  })
  rewardItemIds: (RewardItem | string)[];
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
