import { cookies } from 'next/headers';
import { verifyAccessToken } from './jwt';
import { getAccessToken } from '@/utils/storage';
import type { UserPayload } from '@/modules/auth/auth.types';

export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return null;
    }

    const decoded = verifyAccessToken(accessToken);
    return decoded;
  } catch {
    return null;
  }
}

export function getCurrentUserFromClient(): UserPayload | null {
  try {
    const token = getAccessToken();

    if (!token) {
      return null;
    }

    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    const decoded = JSON.parse(jsonPayload);
    return {
      userId: decoded.userId || decoded.sub || decoded.id,
      email: decoded.email,
    };
  } catch {
    return null;
  }
}

