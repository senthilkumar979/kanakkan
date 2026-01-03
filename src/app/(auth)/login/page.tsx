'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthForm } from '@/ui/organisms/AuthForm';
import { loginUser } from '@/services/auth.service';
import { setAccessToken, setRefreshToken } from '@/utils/storage';
import { useAuth } from '@/hooks/useAuth';
import type { LoginInput } from '@/modules/auth/auth.schema';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await loginUser(data);

      if (!result.success) {
        setError(result.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      if (result.data?.accessToken && result.data?.refreshToken) {
        setAccessToken(result.data.accessToken);
        setRefreshToken(result.data.refreshToken);
        
        // Trigger auth state update
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-state-changed'));
        }
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50/50 to-pink-50/50 shadow-2xl sm:rounded-3xl">
        <div className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-4">
              <span className="text-4xl">🔐</span>
            </div>
            <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              Welcome back
            </h1>
            <p className="mt-2 text-base text-gray-700">
              Sign in to your account to continue
            </p>
          </div>

          <AuthForm
            mode="login"
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>

        <div className="border-t-2 border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50 px-6 py-4 sm:px-8">
          <div className="space-y-2 text-center text-sm text-gray-700">
            <p>
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-bold text-purple-600 transition-colors hover:text-pink-600 hover:underline"
              >
                Create one
              </Link>
            </p>
            <p>
              <Link
                href="/forgot-password"
                className="font-semibold text-purple-600 transition-colors hover:text-pink-600 hover:underline"
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
