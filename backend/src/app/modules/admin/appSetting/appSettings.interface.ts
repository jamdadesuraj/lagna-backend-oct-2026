import { Document } from 'mongoose';

export interface IAppSettings extends Document {
  appName: string;
  mobileNo?: string;
  whatsappNo?: string;
  supportEmail?: string;
  businessEmail?: string;
  websiteUrl?: string;
  address?: string;

  googlePlayUrl?: string;
  appStoreUrl?: string;

  supportHours?: string;
  copyrightText?: string;

  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;

  appLogo?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
