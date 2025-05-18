import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ClaimStatus } from 'src/common/constants/event';
import { EVENT_EVENT_TYPE } from 'src/common/constants/listener';

@Schema({ timestamps: true })
export class EventLog extends Document {
  // this event is about log event rather than user event
  @Prop({ required: true })
  eventType: EVENT_EVENT_TYPE;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({
    enum: ClaimStatus,
    type: String,
  })
  finalClaimStatus: ClaimStatus;

  @Prop()
  message: string;
}

export const EventLogSchema = SchemaFactory.createForClass(EventLog);
