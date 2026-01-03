import { z } from 'zod';

export const createIncomeSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .finite('Amount must be a valid number'),
  incomeCategoryId: z.string().min(1, 'Income category ID is required'),
  source: z
    .string()
    .min(1, 'Source is required')
    .max(200, 'Source must be less than 200 characters')
    .trim(),
  accountId: z.string().min(1, 'Account ID is required'),
  date: z.string().datetime('Date must be a valid ISO date string'),
});

export const updateIncomeSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .finite('Amount must be a valid number')
    .optional(),
  incomeCategoryId: z.string().min(1, 'Income category ID is required').optional(),
  source: z
    .string()
    .min(1, 'Source is required')
    .max(200, 'Source must be less than 200 characters')
    .trim()
    .optional(),
  accountId: z.string().min(1, 'Account ID is required').optional(),
  date: z.string().datetime('Date must be a valid ISO date string').optional(),
});

export type CreateIncomeInput = z.infer<typeof createIncomeSchema>;
export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>;

