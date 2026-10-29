import mongoose, { Schema } from 'mongoose';
import { IAboutUs } from './aboutUs.interface';

const statSchema = new Schema(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const awardSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: '' },
    year: { type: String, trim: true, default: '' },
  },
  { _id: false },
);

const stepSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
  },
  { _id: false },
);

const aboutUsSchema = new Schema<IAboutUs>(
  {
    // Hero
    heroBadge: { type: String, trim: true, default: '' },
    heroTitle: { type: String, trim: true, default: '' },
    heroHighlightedTitle: { type: String, trim: true, default: '' },
    heroDescription: { type: String, trim: true, default: '' },
    heroBadgeText: { type: String, trim: true, default: '' },
    heroImage: { type: String, trim: true, default: '' },

    // CEO
    ceoSectionTitle: { type: String, trim: true, default: '' },
    ceoName: { type: String, trim: true, default: '' },
    ceoDesignation: { type: String, trim: true, default: '' },
    ceoLetter: { type: String, trim: true, default: '' },
    ceoImage: { type: String, trim: true, default: '' },

    // Mission & Vision
    missionVisionTitle: { type: String, trim: true, default: '' },
    missionTitle: { type: String, trim: true, default: '' },
    missionDescription: { type: String, trim: true, default: '' },
    visionTitle: { type: String, trim: true, default: '' },
    visionDescription: { type: String, trim: true, default: '' },

    // About
    aboutSectionTitle: { type: String, trim: true, default: '' },
    aboutDescription: { type: String, trim: true, default: '' },
    aboutImage: { type: String, trim: true, default: '' },
    stats: { type: [statSchema], default: [] },

    // Awards
    awardSectionTitle: { type: String, trim: true, default: '' },
    awards: { type: [awardSchema], default: [] },

    // How To Use
    howToTitle: { type: String, trim: true, default: '' },
    steps: { type: [stepSchema], default: [] },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const AboutUs = mongoose.model<IAboutUs>('AboutUs', aboutUsSchema);
