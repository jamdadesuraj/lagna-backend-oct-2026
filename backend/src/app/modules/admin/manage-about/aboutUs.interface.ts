import { Document } from 'mongoose';

export interface IStat {
  value: string;
  label: string;
}

export interface IAward {
  title: string;
  subtitle: string;
  year: string;
}

export interface IStep {
  title: string;
  description: string;
}

export interface IAboutUs extends Document {
  // Hero
  heroBadge: string;
  heroTitle: string;
  heroHighlightedTitle: string;
  heroDescription: string;
  heroBadgeText: string;
  heroImage: string;

  // CEO
  ceoSectionTitle: string;
  ceoName: string;
  ceoDesignation: string;
  ceoLetter: string;
  ceoImage: string;

  // Mission & Vision
  missionVisionTitle: string;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;

  // About
  aboutSectionTitle: string;
  aboutDescription: string;
  aboutImage: string;
  stats: IStat[];

  // Awards
  awardSectionTitle: string;
  awards: IAward[];

  // How To Use
  howToTitle: string;
  steps: IStep[];

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
