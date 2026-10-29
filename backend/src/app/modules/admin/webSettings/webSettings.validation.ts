import { z } from 'zod';

export const updateWebSettingsSchema = z.object({
  websiteUrl: z
    .string()
    .trim()
    .url('Website URL must be a valid URL.')
    .optional()
    .or(z.literal('')),
  tagline: z.string().trim().max(200).optional(),

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

  address: z.string().trim().max(500).optional(),
  supportHours: z.string().trim().max(200).optional(),

  metaTitle: z.string().trim().max(200).optional(),
  metaDescription: z.string().trim().max(500).optional(),
  metaKeywords: z.string().trim().max(300).optional(),

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
  twitterUrl: z
    .string()
    .trim()
    .url('X/Twitter URL must be a valid URL.')
    .optional()
    .or(z.literal('')),

  copyrightText: z.string().trim().max(300).optional(),
  footerDescription: z.string().trim().max(1000).optional(),

  maintenanceMode: z.boolean().optional(),

  logo: z.string().trim().optional(),
  favicon: z.string().trim().optional(),
});
