import { cookies } from 'next/headers';
import { env } from './env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 4 * 60 * 60, // 4 hours
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
}

export async function getRefreshTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value ?? null;
}

