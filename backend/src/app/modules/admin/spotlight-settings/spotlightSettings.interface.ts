import { Document } from 'mongoose';

export interface ISpotlightSettings extends Document {
  amount: number;
  updatedAt?: Date;
}
