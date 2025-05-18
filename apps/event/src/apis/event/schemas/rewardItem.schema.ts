import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RewardItem extends Document {
  // TODO: refer item to item collection, not just string
  @Prop({ required: true })
  item: string;

  @Prop({ required: true })
  quantity: number;
}

export const RewardItemSchema = SchemaFactory.createForClass(RewardItem);
