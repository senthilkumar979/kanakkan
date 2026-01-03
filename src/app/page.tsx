'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/ui/atoms/Button';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent shadow-lg"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 sm:p-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-6xl font-extrabold text-transparent sm:text-7xl">
            Kanakkan
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-pink-500 delay-75"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500 delay-150"></div>
          </div>
        </div>
        <p className="mt-6 text-xl text-gray-700 sm:text-2xl">
          Track your income and expenses with ease. Get insights into your
          financial health with beautiful dashboards and analytics.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:shadow-purple-500/60"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-500 text-purple-600 transition-all hover:border-purple-600 hover:bg-purple-50"
            >
              Sign In
            </Button>
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 p-6 shadow-lg">
            <div className="mb-2 text-3xl">💰</div>
            <h3 className="font-semibold text-purple-900">Track Expenses</h3>
            <p className="mt-2 text-sm text-purple-700">
              Monitor your spending habits
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 p-6 shadow-lg">
            <div className="mb-2 text-3xl">📊</div>
            <h3 className="font-semibold text-pink-900">Analytics</h3>
            <p className="mt-2 text-sm text-pink-700">
              Visual insights and reports
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 p-6 shadow-lg">
            <div className="mb-2 text-3xl">🎯</div>
            <h3 className="font-semibold text-blue-900">Smart Budgeting</h3>
            <p className="mt-2 text-sm text-blue-700">
              Achieve your financial goals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
