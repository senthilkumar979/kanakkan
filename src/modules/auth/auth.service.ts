import bcrypt from 'bcrypt';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import { User } from './auth.model';
import { PasswordResetToken } from './password-reset.model';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/lib/jwt';
import type { AuthResult, TokenPair, UserPayload } from './auth.types';
import type { RegisterInput, LoginInput } from './auth.schema';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function registerUser(
  input: RegisterInput
): Promise<AuthResult> {
  try {
    await connectDB();
  } catch {
    throw new Error(
      'Database connection failed. Please check your database configuration.'
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingUser = await (User as any).findOne({ email: input.email }).select(
    '_id'
  );

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await hashPassword(input.password);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await (User as any).create({
    email: input.email,
    password: hashedPassword,
  });

  const payload: UserPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await (User as any).findOne({ email: input.email }).select(
    '+password +refreshToken'
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await comparePassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const payload: UserPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}

export async function refreshTokens(
  refreshToken: string
): Promise<TokenPair> {
  await connectDB();

  const decoded = verifyRefreshToken(refreshToken);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await (User as any).findById(decoded.userId).select(
    '+refreshToken'
  );

  if (!user) {
    throw new Error('User not found');
  }

  if (user.refreshToken !== refreshToken) {
    throw new Error('Invalid refresh token');
  }

  const payload: UserPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logoutUser(userId: string): Promise<void> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await (User as any).findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });
}

export async function getUserProfile(userId: string): Promise<{
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await (User as any).findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name ? user.name : undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function updateUserProfile(
  userId: string,
  input: { email?: string; name?: string }
): Promise<{
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}> {
  await connectDB();

  console.log('Service - Input received:', input);
  console.log('Service - UserId:', userId);
  console.log('Service - "name" in input?', 'name' in input);

  const updateFields: { email?: string; name?: string | null } = {};

  if (input.email) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingUser = await (User as any).findOne({ email: input.email, _id: { $ne: userId } });
    if (existingUser) {
      throw new Error('Email already in use');
    }
    updateFields.email = input.email;
  }

  if ('name' in input) {
    // Trim the name and set to null if empty, otherwise set to trimmed value
    const nameValue = input.name || '';
    const trimmedName = nameValue.trim();
    updateFields.name = trimmedName.length > 0 ? trimmedName : null;
    console.log('Service - Processing name:', { nameValue, trimmedName, final: updateFields.name });
  }

  console.log('Service - Update fields to apply:', updateFields);

  // Use findByIdAndUpdate to ensure the update is applied
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatedUser = await (User as any).findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  console.log('Service - User after update:', updatedUser?.name);

  if (!updatedUser) {
    throw new Error('User not found');
  }

  // Verify the update by fetching the user again
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const verifyUser = await (User as any).findById(userId);
  console.log('Service - Verified user name from DB:', verifyUser?.name);

  return {
    id: updatedUser._id.toString(),
    email: updatedUser.email,
    name: updatedUser.name ? updatedUser.name : undefined,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };
}

export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await (User as any).findById(userId).select('+password');

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await comparePassword(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save({ validateBeforeSave: false });
}

export async function requestPasswordReset(email: string): Promise<{
  token: string;
  userId: string;
}> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await (User as any).findOne({ email });

  if (!user) {
    // Don't reveal if email exists - security best practice
    // Return success even if user doesn't exist
    throw new Error('If an account with that email exists, a password reset link has been sent');
  }

  // Generate secure random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

  // Invalidate any existing reset tokens for this user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (PasswordResetToken as any).updateMany(
    { userId: user._id.toString(), used: false },
    { used: true }
  );

  // Create new reset token
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (PasswordResetToken as any).create({
    userId: user._id.toString(),
    token: resetToken,
    expiresAt,
    used: false,
  });

  return {
    token: resetToken,
    userId: user._id.toString(),
  };
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<void> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resetToken = await (PasswordResetToken as any).findOne({
    token,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!resetToken) {
    throw new Error('Invalid or expired reset token');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = await (User as any).findById(resetToken.userId).select('+password');

  if (!user) {
    throw new Error('User not found');
  }

  // Hash and update password
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save({ validateBeforeSave: false });

  // Mark token as used
  resetToken.used = true;
  await resetToken.save();

  // Invalidate all refresh tokens for security
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });
}

