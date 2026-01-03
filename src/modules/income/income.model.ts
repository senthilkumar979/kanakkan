import mongoose, { Schema, model, models } from 'mongoose';

export interface IIncome extends mongoose.Document {
  amount: number;
  incomeCategoryId: string;
  source: string;
  accountId: string;
  date: Date;
  userId: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const incomeSchema = new Schema<IIncome>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    incomeCategoryId: {
      type: String,
      required: true,
      index: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
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

incomeSchema.index({ userId: 1, deletedAt: 1 });
incomeSchema.index({ userId: 1, date: 1, deletedAt: 1 });
incomeSchema.index({ userId: 1, incomeCategoryId: 1, deletedAt: 1 });

export const Income = models.Income || model<IIncome>('Income', incomeSchema);

