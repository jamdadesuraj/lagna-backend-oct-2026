import { Schema, model } from 'mongoose';
import { IWebSettings } from './webSettings.interface';

const webSettingsSchema = new Schema<IWebSettings>(
  {
    websiteUrl: {
      type: String,
      trim: true,
    },

    tagline: {
      type: String,
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

    address: {
      type: String,
      trim: true,
    },

    supportHours: {
      type: String,
      trim: true,
    },

    metaTitle: {
      type: String,
      trim: true,
    },

    metaDescription: {
      type: String,
      trim: true,
    },

    metaKeywords: {
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

    twitterUrl: {
      type: String,
      trim: true,
    },

    copyrightText: {
      type: String,
      trim: true,
    },

    footerDescription: {
      type: String,
      trim: true,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    logo: {
      type: String,
      trim: true,
    },

    favicon: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const WebSettings = model<IWebSettings>(
  'WebSettings',
  webSettingsSchema,
);
