import { z } from 'zod';
import { BiodataTemplateStatus } from './biodataTemplate.interface';

export const createBiodataTemplateSchema = z.object({
  template: z
    .string()
    .trim()
    .min(1, 'Template image is required.')
    .url('Template must be a valid URL.'),

  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(200, 'Title cannot exceed 200 characters.'),

  // multipart/form-data sends every field as a string (e.g. "500"),
  // so we coerce it to a number before validating.
  price: z.coerce
    .number('Price must be a number.')
    .min(0, 'Price cannot be negative.'),

  description: z
    .string()
    .trim()
    .min(1, 'Description is required.')
    .max(1000, 'Description cannot exceed 1000 characters.'),

  status: z.nativeEnum(BiodataTemplateStatus).optional(),
});

export const updateBiodataTemplateSchema = z.object({
  template: z.string().trim().url('Template must be a valid URL.').optional(),

  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty.')
    .max(200, 'Title cannot exceed 200 characters.')
    .optional(),

  // Was missing entirely before — admin could never update price after
  // creation. Coerced for the same multipart/form-data reason as above.
  price: z.coerce
    .number('Price must be a number.')
    .min(0, 'Price cannot be negative.')
    .optional(),

  description: z
    .string()
    .trim()
    .min(1, 'Description cannot be empty.')
    .max(1000, 'Description cannot exceed 1000 characters.')
    .optional(),

  status: z.nativeEnum(BiodataTemplateStatus).optional(),
});
