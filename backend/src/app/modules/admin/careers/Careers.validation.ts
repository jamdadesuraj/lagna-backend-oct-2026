import { z } from 'zod';

export const createCareersSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(200, 'Title cannot exceed 200 characters.'),

  subtitle: z
    .string()
    .trim()
    .max(300, 'Subtitle cannot exceed 300 characters.')
    .optional(),

  images: z
    .array(z.string().trim().url('Each image must be a valid URL.'))
    .optional(),
});

export const updateCareersSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty.')
    .max(200, 'Title cannot exceed 200 characters.')
    .optional(),

  subtitle: z
    .string()
    .trim()
    .max(300, 'Subtitle cannot exceed 300 characters.')
    .optional(),

  images: z
    .array(z.string().trim().url('Each image must be a valid URL.'))
    .optional(),
});

// Body shape for removing a single already-uploaded image from the gallery
export const removeCareerImageSchema = z.object({
  image: z
    .string()
    .trim()
    .min(1, 'Image URL is required.')
    .url('Image must be a valid URL.'),
});
