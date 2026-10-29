import { Schema, model } from 'mongoose';
import { ISpotlight } from './spotlight.interface';

const spotlightSchema = new Schema<ISpotlight>(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      unique: true,
    },

    activatedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: false,
  },
);

// Auto-cleanup only — has no effect on ranking, which is decided by
// comparing expiresAt to "now" at query time in getProfiles.
spotlightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Spotlight = model<ISpotlight>('Spotlight', spotlightSchema);
