import { z } from 'zod';

export const downloadApkSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),

  subtitle: z.string().trim().optional(),

  googlePlayUrl: z
    .string()
    .trim()
    .url('Enter a valid Google Play URL')
    .optional()
    .or(z.literal('')),

  appStoreUrl: z
    .string()
    .trim()
    .url('Enter a valid App Store URL')
    .optional()
    .or(z.literal('')),
});

export type DownloadApkInput = z.infer<typeof downloadApkSchema>;
