import { z } from 'zod';

export const statSchema = z.object({
  value: z.string().trim().min(1, 'Stat value is required'),
  label: z.string().trim().min(1, 'Stat label is required'),
});

export const awardSchema = z.object({
  title: z.string().trim().min(1, 'Award title is required'),
  subtitle: z.string().trim().optional().default(''),
  year: z.string().trim().optional().default(''),
});

export const stepSchema = z.object({
  title: z.string().trim().min(1, 'Step title is required'),
  description: z.string().trim().optional().default(''),
});

export const aboutUsValidation = z.object({
  // Hero
  heroBadge: z.string().trim().optional().default(''),
  heroTitle: z.string().trim().optional().default(''),
  heroHighlightedTitle: z.string().trim().optional().default(''),
  heroDescription: z.string().trim().optional().default(''),
  heroBadgeText: z.string().trim().optional().default(''),

  // CEO
  ceoSectionTitle: z.string().trim().optional().default(''),
  ceoName: z.string().trim().optional().default(''),
  ceoDesignation: z.string().trim().optional().default(''),
  ceoLetter: z.string().trim().optional().default(''),

  // Mission & Vision
  missionVisionTitle: z.string().trim().optional().default(''),
  missionTitle: z.string().trim().optional().default(''),
  missionDescription: z.string().trim().optional().default(''),
  visionTitle: z.string().trim().optional().default(''),
  visionDescription: z.string().trim().optional().default(''),

  // About
  aboutSectionTitle: z.string().trim().optional().default(''),
  aboutDescription: z.string().trim().optional().default(''),
  stats: z.array(statSchema).optional().default([]),

  // Awards
  awardSectionTitle: z.string().trim().optional().default(''),
  awards: z.array(awardSchema).optional().default([]),

  // How To Use
  howToTitle: z.string().trim().optional().default(''),
  steps: z.array(stepSchema).optional().default([]),
});

export type AboutUsInput = z.infer<typeof aboutUsValidation>;
