import { Schema, model } from 'mongoose';
import { IAppSettings } from './appSettings.interface';

const appSettingsSchema = new Schema<IAppSettings>(
  {
    appName: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNo: {
      type: String,
      trim: true,
    },

    whatsappNo: {
      type: String,
      trim: true,
    },

    supportEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    businessEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    websiteUrl: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    googlePlayUrl: {
      type: String,
      trim: true,
    },

    appStoreUrl: {
      type: String,
      trim: true,
    },

    supportHours: {
      type: String,
      trim: true,
    },

    copyrightText: {
      type: String,
      trim: true,
    },

    facebookUrl: {
      type: String,
      trim: true,
    },

    instagramUrl: {
      type: String,
      trim: true,
    },

    youtubeUrl: {
      type: String,
      trim: true,
    },

    linkedinUrl: {
      type: String,
      trim: true,
    },

    appLogo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const AppSettings = model<IAppSettings>(
  'AppSettings',
  appSettingsSchema,
);
