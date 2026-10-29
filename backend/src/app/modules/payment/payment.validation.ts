import { z } from 'zod';

export const createPaymentOrderSchema = z.object({
  body: z.object({
    packageId: z.string().min(1, 'Package ID is required'),
  }),
});

export const createBiodataOrderSchema = z.object({
  body: z.object({
    templateId: z
      .string()
      .min(1, 'Template ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid template ID'),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpayOrderId: z.string().min(1, 'Razorpay order ID is required'),

    razorpayPaymentId: z.string().min(1, 'Razorpay payment ID is required'),

    razorpaySignature: z.string().min(1, 'Razorpay signature is required'),
  }),
});
