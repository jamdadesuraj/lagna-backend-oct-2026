import { Schema, model } from 'mongoose';
import { IContactView } from './contactView.interface';

const contactViewSchema = new Schema<IContactView>(
  {
    viewerId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    viewedProfileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

contactViewSchema.index({ viewerId: 1, viewedProfileId: 1 }, { unique: true });

export const ContactView = model<IContactView>(
  'ContactView',
  contactViewSchema,
);
