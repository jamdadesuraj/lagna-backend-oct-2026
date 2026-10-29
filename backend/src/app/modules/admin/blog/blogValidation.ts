import { z } from 'zod';

export const createBlogSchema = z.object({
  image: z
    .string()
    .trim()
    .min(1, 'Image is required.')
    .url('Image must be a valid URL.'),

  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(200, 'Title cannot exceed 200 characters.'),

  subtitle: z
    .string()
    .trim()
    .min(1, 'Sub-title is required.')
    .max(200, 'Sub-title cannot exceed 200 characters.'),

  desc: z
    .string()
    .trim()
    .min(1, 'Description is required.')
    .max(2000, 'Description cannot exceed 2000 characters.'),

  isActive: z.boolean().optional(),
});

export const updateBlogSchema = z.object({
  image: z.string().trim().url('Image must be a valid URL.').optional(),

  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty.')
    .max(200, 'Title cannot exceed 200 characters.')
    .optional(),

  subtitle: z
    .string()
    .trim()
    .min(1, 'Sub-title cannot be empty.')
    .max(200, 'Sub-title cannot exceed 200 characters.')
    .optional(),

  desc: z
    .string()
    .trim()
    .min(1, 'Description cannot be empty.')
    .max(2000, 'Description cannot exceed 2000 characters.')
    .optional(),

  isActive: z.boolean().optional(),
});
