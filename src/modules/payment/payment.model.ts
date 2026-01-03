import mongoose, { Schema, model, models } from 'mongoose';

export interface IMoneyMode extends mongoose.Document {
  name: string;
  userId: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentType extends mongoose.Document {
  name: string;
  userId: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICard extends mongoose.Document {
  providerName: string;
  userId: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const moneyModeSchema = new Schema<IMoneyMode>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
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

moneyModeSchema.index({ userId: 1, deletedAt: 1 });
moneyModeSchema.index({ userId: 1, name: 1, deletedAt: 1 }, { unique: true });

const paymentTypeSchema = new Schema<IPaymentType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
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

paymentTypeSchema.index({ userId: 1, deletedAt: 1 });
paymentTypeSchema.index({ userId: 1, name: 1, deletedAt: 1 }, { unique: true });

const cardSchema = new Schema<ICard>(
  {
    providerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
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

cardSchema.index({ userId: 1, deletedAt: 1 });
cardSchema.index({ userId: 1, providerName: 1, deletedAt: 1 }, { unique: true });

export const MoneyMode =
  models.MoneyMode || model<IMoneyMode>('MoneyMode', moneyModeSchema);

export const PaymentType =
  models.PaymentType || model<IPaymentType>('PaymentType', paymentTypeSchema);

export const Card = models.Card || model<ICard>('Card', cardSchema);

