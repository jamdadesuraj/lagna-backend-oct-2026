import { Schema, model } from 'mongoose';
import { ISpotlightSettings } from './spotlightSettings.interface';

const spotlightSettingsSchema = new Schema<ISpotlightSettings>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const SpotlightSettings = model<ISpotlightSettings>(
  'SpotlightSettings',
  spotlightSettingsSchema,
);
