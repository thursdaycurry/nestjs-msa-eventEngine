import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum LoginType {
  CREDENTIALS = 'credentials',
  SSO = 'sso',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: LoginType })
  loginType: LoginType;
}

export const UserSchema = SchemaFactory.createForClass(User);
