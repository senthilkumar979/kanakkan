import jwt from 'jsonwebtoken';
import { env } from './env';
import type { UserPayload } from '@/modules/auth/auth.types';

const ACCESS_TOKEN_EXPIRY = '4h';
const REFRESH_TOKEN_EXPIRY = '7d';

export function generateAccessToken(payload: UserPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(payload: UserPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function verifyAccessToken(token: string): UserPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    throw new Error('Token verification failed');
  }
}

export function verifyRefreshToken(token: string): UserPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw new Error('Token verification failed');
  }
}

