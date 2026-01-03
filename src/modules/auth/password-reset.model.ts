import mongoose, { Schema, model, models } from 'mongoose';

export interface IPasswordResetToken extends mongoose.Document {
  userId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
      expires: 0, // TTL index - automatically delete expired documents
    },
    used: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookups
passwordResetTokenSchema.index({ userId: 1, used: 1 });
passwordResetTokenSchema.index({ token: 1, used: 1, expiresAt: 1 });

export const PasswordResetToken =
  models.PasswordResetToken ||
  model<IPasswordResetToken>('PasswordResetToken', passwordResetTokenSchema);

