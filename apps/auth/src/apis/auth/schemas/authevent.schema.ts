import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AUTH_EVENT_TYPE } from 'src/common/constants/listener';

@Schema({ timestamps: true })
export class AuthEvent extends Document {
  @Prop({ required: true })
  eventType: AUTH_EVENT_TYPE;

  @Prop()
  userId: string;
}

export const AuthEventSchema = SchemaFactory.createForClass(AuthEvent);
