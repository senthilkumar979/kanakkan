import type { RegisterInput, LoginInput } from '@/modules/auth/auth.schema';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Request failed',
        details: data.details,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

export async function registerUser(
  input: RegisterInput
): Promise<
  ApiResponse<{
    user: { id: string; email: string };
    accessToken: string;
    refreshToken: string;
  }>
> {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function loginUser(
  input: LoginInput
): Promise<
  ApiResponse<{
    user: { id: string; email: string };
    accessToken: string;
    refreshToken: string;
  }>
> {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function logoutUser(): Promise<ApiResponse<{ message: string }>> {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
  });
}

export async function refreshTokens(): Promise<
  ApiResponse<{ message: string }>
> {
  return apiRequest('/api/auth/refresh', {
    method: 'POST',
  });
}

export async function forgotPassword(
  email: string
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

