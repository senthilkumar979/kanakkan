import { z } from 'zod';

export const categoryTypeSchema = z.enum(['EXPENSE', 'INCOME']);

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  type: categoryTypeSchema,
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .optional(),
  type: categoryTypeSchema.optional(),
});

export const createSubCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  categoryId: z.string().min(1, 'Category ID is required'),
});

export const updateSubCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .optional(),
  categoryId: z.string().min(1, 'Category ID is required').optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateSubCategoryInput = z.infer<typeof createSubCategorySchema>;
export type UpdateSubCategoryInput = z.infer<typeof updateSubCategorySchema>;

