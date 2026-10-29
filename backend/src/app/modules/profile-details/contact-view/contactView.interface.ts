import { Document, Types } from 'mongoose';

export interface IContactView extends Document {
  viewerId: Types.ObjectId;
  viewedProfileId: Types.ObjectId;
  viewedAt: Date;
}
