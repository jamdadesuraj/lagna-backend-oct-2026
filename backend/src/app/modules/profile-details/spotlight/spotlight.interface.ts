import { Document, Types } from 'mongoose';

export interface ISpotlight extends Document {
  profileId: Types.ObjectId;
  activatedAt: Date;
  expiresAt: Date;
}
