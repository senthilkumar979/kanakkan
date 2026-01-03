'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/ui/atoms/Input';
import { Label } from '@/ui/atoms/Label';
import { Button } from '@/ui/atoms/Button';
import { ErrorMessage } from '@/ui/molecules/ErrorMessage';
import { SuccessMessage } from '@/ui/molecules/SuccessMessage';
import { resetPassword } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';
import { resetPasswordSchema } from '@/modules/auth/auth.schema';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  if (!token && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);
    setSuccess(false);

    try {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      const validationResult = resetPasswordSchema.safeParse({
        token,
        newPassword,
      });

      if (!validationResult.success) {
        setError(
          validationResult.error.errors
            .map((err) => err.message)
            .join(', ')
        );
        setIsLoading(false);
        return;
      }

      const result = await resetPassword(
        validationResult.data.token,
        validationResult.data.newPassword
      );

      if (!result.success) {
        setError(result.error || 'Failed to reset password');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
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
      <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-white via-green-50/50 to-emerald-50/50 shadow-2xl sm:rounded-3xl">
        <div className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-green-600 to-emerald-600 p-4">
              <span className="text-4xl">🔐</span>
            </div>
            <h1 className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              Reset Password
            </h1>
            <p className="mt-2 text-base text-gray-700">
              Enter your new password below
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <SuccessMessage>
                Password has been reset successfully! Redirecting to login...
              </SuccessMessage>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <ErrorMessage>{error}</ErrorMessage>}

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  autoFocus
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Min 8 characters, 1 uppercase, 1 lowercase, 1 number
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50 hover:shadow-xl"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </div>

        <div className="border-t-2 border-green-200 bg-gradient-to-r from-green-50/50 to-emerald-50/50 px-6 py-4 sm:px-8">
          <p className="text-center text-sm text-gray-700">
            Remember your password?{' '}
            <Link
              href="/login"
              className="font-bold text-green-600 transition-colors hover:text-emerald-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

