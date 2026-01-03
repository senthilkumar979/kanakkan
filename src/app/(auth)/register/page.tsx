'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthForm } from '@/ui/organisms/AuthForm';
import { registerUser } from '@/services/auth.service';
import { setAccessToken, setRefreshToken } from '@/utils/storage';
import { useAuth } from '@/hooks/useAuth';
import type { RegisterInput } from '@/modules/auth/auth.schema';

export default function RegisterPage() {
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
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await registerUser(data);

      if (!result.success) {
        let errorMessage = result.error || 'Registration failed';

        if (result.details && Array.isArray(result.details)) {
          const validationErrors = result.details
            .map((err: { message?: string; path?: string[] }) => {
              const field = err.path?.join('.') || 'field';
              return err.message ? `${field}: ${err.message}` : null;
            })
            .filter(Boolean)
            .join(', ');

          if (validationErrors) {
            errorMessage = validationErrors;
          }
        }

        setError(errorMessage);
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
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/50 shadow-2xl sm:rounded-3xl">
        <div className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 p-4">
              <span className="text-4xl">✨</span>
            </div>
            <h1 className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              Create your account
            </h1>
            <p className="mt-2 text-base text-gray-700">
              Get started by creating a new account
            </p>
          </div>

          <AuthForm
            mode="register"
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>

        <div className="border-t-2 border-blue-200 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 px-6 py-4 sm:px-8">
          <p className="text-center text-sm text-gray-700">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-blue-600 transition-colors hover:text-cyan-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
