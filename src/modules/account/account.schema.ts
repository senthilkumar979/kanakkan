import { z } from 'zod';

export const createBankAccountSchema = z.object({
  name: z
    .string()
    .min(1, 'Account name is required')
    .max(100, 'Account name must be less than 100 characters')
    .trim(),
  bankName: z
    .string()
    .min(1, 'Bank name is required')
    .max(100, 'Bank name must be less than 100 characters')
    .trim(),
  accountNumber: z
    .string()
    .max(50, 'Account number must be less than 50 characters')
    .trim()
    .optional(),
  ifscCode: z
    .string()
    .max(11, 'IFSC code must be less than 11 characters')
    .trim()
    .optional(),
  accountType: z.enum(['SAVINGS', 'CURRENT', 'FIXED_DEPOSIT', 'RECURRING_DEPOSIT', 'OTHER']),
});

export const updateBankAccountSchema = z.object({
  name: z
    .string()
    .min(1, 'Account name is required')
    .max(100, 'Account name must be less than 100 characters')
    .trim()
    .optional(),
  bankName: z
    .string()
    .min(1, 'Bank name is required')
    .max(100, 'Bank name must be less than 100 characters')
    .trim()
    .optional(),
  accountNumber: z
    .string()
    .max(50, 'Account number must be less than 50 characters')
    .trim()
    .optional(),
  ifscCode: z
    .string()
    .max(11, 'IFSC code must be less than 11 characters')
    .trim()
    .optional(),
  accountType: z
    .enum(['SAVINGS', 'CURRENT', 'FIXED_DEPOSIT', 'RECURRING_DEPOSIT', 'OTHER'])
    .optional(),
});

export type CreateBankAccountInput = z.infer<typeof createBankAccountSchema>;
export type UpdateBankAccountInput = z.infer<typeof updateBankAccountSchema>;

