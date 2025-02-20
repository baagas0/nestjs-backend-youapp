import { Document } from 'mongoose';
export enum Gender {
  MAN = 'man',
  WOMAN = 'woman',
}

export interface IUser extends Document {
  readonly name: string;
  readonly username: string;
  readonly email: string;
  readonly gender: Gender;
  readonly birthday: Date;
  readonly horoscope: string;
  readonly zodiac: string;
  readonly height: number;
  readonly weight: number;
  readonly interests: string[];
  readonly picture: string;
  readonly password: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
