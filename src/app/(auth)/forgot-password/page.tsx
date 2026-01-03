'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/ui/atoms/Input';
import { Label } from '@/ui/atoms/Label';
import { Button } from '@/ui/atoms/Button';
import { ErrorMessage } from '@/ui/molecules/ErrorMessage';
import { SuccessMessage } from '@/ui/molecules/SuccessMessage';
import { forgotPassword } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';
import { forgotPasswordSchema } from '@/modules/auth/auth.schema';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);
    setSuccess(false);

    try {
      const validationResult = forgotPasswordSchema.safeParse({ email });

      if (!validationResult.success) {
        setError(
          validationResult.error.errors
            .map((err) => err.message)
            .join(', ')
        );
        setIsLoading(false);
        return;
      }

      const result = await forgotPassword(validationResult.data.email);

      if (!result.success) {
        setError(result.error || 'Failed to send reset email');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-white via-orange-50/50 to-amber-50/50 shadow-2xl sm:rounded-3xl">
        <div className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-orange-600 to-amber-600 p-4">
              <span className="text-4xl">🔑</span>
            </div>
            <h1 className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              Forgot Password
            </h1>
            <p className="mt-2 text-base text-gray-700">
              Enter your email address and we&apos;ll send you a link to reset your password
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <SuccessMessage>
                If an account with that email exists, a password reset link has been sent. Please check your email.
              </SuccessMessage>
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-orange-600 transition-colors hover:text-amber-600 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <ErrorMessage>{error}</ErrorMessage>}

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/50 hover:shadow-xl"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </div>

        <div className="border-t-2 border-orange-200 bg-gradient-to-r from-orange-50/50 to-amber-50/50 px-6 py-4 sm:px-8">
          <p className="text-center text-sm text-gray-700">
            Remember your password?{' '}
            <Link
              href="/login"
              className="font-bold text-orange-600 transition-colors hover:text-amber-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

