import { Document } from 'mongoose';

export interface IWebSettings extends Document {
  websiteUrl?: string;
  tagline?: string;

  mobileNo?: string;
  whatsappNo?: string;
  supportEmail?: string;
  businessEmail?: string;
  address?: string;
  supportHours?: string;

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;

  copyrightText?: string;
  footerDescription?: string;

  maintenanceMode: boolean;

  logo?: string;
  favicon?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
