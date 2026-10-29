import { z } from 'zod';

export const updateAppSettingsSchema = z.object({
  appName: z
    .string()
    .trim()
    .min(1, 'App name is required.')
    .max(150, 'App name cannot exceed 150 characters.'),

  mobileNo: z.string().trim().max(20).optional(),
  whatsappNo: z.string().trim().max(20).optional(),

  supportEmail: z
    .string()
    .trim()
    .email('Support email must be a valid email address.')
    .optional()
    .or(z.literal('')),

  businessEmail: z
    .string()
    .trim()
    .email('Business email must be a valid email address.')
    .optional()
    .or(z.literal('')),

  websiteUrl: z
    .string()
    .trim()
    .url('Website URL must be a valid URL.')
    .optional()
    .or(z.literal('')),

  address: z.string().trim().max(500).optional(),

  googlePlayUrl: z
    .string()
    .trim()
    .url('Google Play URL must be a valid URL.')
    .optional()
    .or(z.literal('')),

  appStoreUrl: z
    .string()
    .trim()
    .url('App Store URL must be a valid URL.')
    .optional()
    .or(z.literal('')),

  supportHours: z.string().trim().max(200).optional(),
  copyrightText: z.string().trim().max(300).optional(),

  facebookUrl: z
    .string()
    .trim()
    .url('Facebook URL must be a valid URL.')
    .optional()
    .or(z.literal('')),

  instagramUrl: z
    .string()
    .trim()
    .url('Instagram URL must be a valid URL.')
    .optional()
    .or(z.literal('')),

  youtubeUrl: z
    .string()
    .trim()
    .url('YouTube URL must be a valid URL.')
    .optional()
    .or(z.literal('')),

  linkedinUrl: z
    .string()
    .trim()
    .url('LinkedIn URL must be a valid URL.')
    .optional()
    .or(z.literal('')),

  appLogo: z.string().trim().optional(),
});
