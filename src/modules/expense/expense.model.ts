import mongoose, { Schema, model, models } from 'mongoose';

export interface IExpense extends mongoose.Document {
  amount: number;
  categoryId: string;
  subCategoryId: string;
  moneyModeId: string;
  cardId?: string;
  paymentTypeId: string;
  accountId: string;
  date: Date;
  note?: string;
  userId: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    categoryId: {
      type: String,
      required: true,
      index: true,
    },
    subCategoryId: {
      type: String,
      required: true,
      index: true,
    },
    moneyModeId: {
      type: String,
      required: true,
      index: true,
    },
    cardId: {
      type: String,
      default: null,
    },
    paymentTypeId: {
      type: String,
      required: true,
      index: true,
    },
    accountId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    note: {
      type: String,
      maxlength: 500,
      default: null,
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

expenseSchema.index({ userId: 1, deletedAt: 1 });
expenseSchema.index({ userId: 1, date: 1, deletedAt: 1 });
expenseSchema.index({ userId: 1, categoryId: 1, deletedAt: 1 });

export const Expense =
  models.Expense || model<IExpense>('Expense', expenseSchema);

