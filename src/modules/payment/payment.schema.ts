import { z } from 'zod';

export const createMoneyModeSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
});

export const updateMoneyModeSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .optional(),
});

export const createPaymentTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
});

export const updatePaymentTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .optional(),
});

export const createCardSchema = z.object({
  providerName: z
    .string()
    .min(1, 'Provider name is required')
    .max(100, 'Provider name must be less than 100 characters')
    .trim(),
});

export const updateCardSchema = z.object({
  providerName: z
    .string()
    .min(1, 'Provider name is required')
    .max(100, 'Provider name must be less than 100 characters')
    .trim()
    .optional(),
});

export type CreateMoneyModeInput = z.infer<typeof createMoneyModeSchema>;
export type UpdateMoneyModeInput = z.infer<typeof updateMoneyModeSchema>;
export type CreatePaymentTypeInput = z.infer<typeof createPaymentTypeSchema>;
export type UpdatePaymentTypeInput = z.infer<typeof updatePaymentTypeSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;

