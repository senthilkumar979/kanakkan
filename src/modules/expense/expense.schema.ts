import { z } from 'zod';

export const createExpenseSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .finite('Amount must be a valid number'),
  categoryId: z.string().min(1, 'Category ID is required'),
  subCategoryId: z.string().min(1, 'Subcategory ID is required'),
  moneyModeId: z.string().min(1, 'Money mode ID is required'),
  cardId: z.string().min(1, 'Card ID is required').optional(),
  paymentTypeId: z.string().min(1, 'Payment type ID is required'),
  accountId: z.string().min(1, 'Account ID is required'),
  date: z.string().datetime('Date must be a valid ISO date string'),
  note: z.string().max(500, 'Note must be less than 500 characters').optional(),
});

export const updateExpenseSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .finite('Amount must be a valid number')
    .optional(),
  categoryId: z.string().min(1, 'Category ID is required').optional(),
  subCategoryId: z.string().min(1, 'Subcategory ID is required').optional(),
  moneyModeId: z.string().min(1, 'Money mode ID is required').optional(),
  cardId: z.string().min(1, 'Card ID is required').optional().nullable(),
  paymentTypeId: z.string().min(1, 'Payment type ID is required').optional(),
  accountId: z.string().min(1, 'Account ID is required').optional(),
  date: z.string().datetime('Date must be a valid ISO date string').optional(),
  note: z.string().max(500, 'Note must be less than 500 characters').optional().nullable(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

