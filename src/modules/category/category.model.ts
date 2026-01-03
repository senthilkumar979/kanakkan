import mongoose, { Schema, model, models } from 'mongoose';
import type { CategoryType } from './category.types';

export interface ICategory extends mongoose.Document {
  name: string;
  type: CategoryType;
  userId: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubCategory extends mongoose.Document {
  name: string;
  categoryId: string;
  userId: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      required: true,
      enum: ['EXPENSE', 'INCOME'],
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ userId: 1, deletedAt: 1 });
categorySchema.index({ userId: 1, type: 1, deletedAt: 1 });

const subCategorySchema = new Schema<ISubCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    categoryId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

subCategorySchema.index({ categoryId: 1, deletedAt: 1 });
subCategorySchema.index({ userId: 1, deletedAt: 1 });
subCategorySchema.index({ userId: 1, categoryId: 1, deletedAt: 1 });

export const Category =
  models.Category || model<ICategory>('Category', categorySchema);

export const SubCategory =
  models.SubCategory || model<ISubCategory>('SubCategory', subCategorySchema);

