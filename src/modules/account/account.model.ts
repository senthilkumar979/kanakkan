import mongoose, { Schema, model, models } from 'mongoose';

export interface IBankAccount extends mongoose.Document {
  name: string;
  bankName: string;
  accountNumber?: string;
  ifscCode?: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'RECURRING_DEPOSIT' | 'OTHER';
  userId: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bankAccountSchema = new Schema<IBankAccount>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    accountNumber: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
    },
    ifscCode: {
      type: String,
      trim: true,
      maxlength: 11,
      default: null,
    },
    accountType: {
      type: String,
      required: true,
      enum: ['SAVINGS', 'CURRENT', 'FIXED_DEPOSIT', 'RECURRING_DEPOSIT', 'OTHER'],
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

bankAccountSchema.index({ userId: 1, deletedAt: 1 });
bankAccountSchema.index({ userId: 1, name: 1, deletedAt: 1 }, { unique: true });

export const BankAccount =
  models.BankAccount || model<IBankAccount>('BankAccount', bankAccountSchema);

