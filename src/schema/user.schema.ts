import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Gender } from '../interface/user.interface';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @Prop({ required: true })
  birthday: Date;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop()
  picture: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
