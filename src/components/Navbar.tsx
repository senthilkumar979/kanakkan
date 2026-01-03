'use client';

import { useAuth } from '@/hooks/useAuth';
import { logoutUser } from '@/services/auth.service';
import { Button } from '@/ui/atoms/Button';
import { clearTokens } from '@/utils/storage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch {
      // Continue with logout even if API call fails
    } finally {
      clearTokens();
      setIsLoggingOut(false);
      router.push('/login');
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Kanakkan
            </Link>
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b-2 border-purple-200 bg-gradient-to-r from-white via-purple-50/50 to-pink-50/50 shadow-lg backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-xl font-extrabold text-transparent transition-all hover:scale-105"
          >
            💰 Kanakkan
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="hidden items-center gap-4 sm:flex">
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white"
                    >
                      📊 Dashboard
                    </Button>
                  </Link>
                  <Link href="/transactions">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white"
                    >
                      ➕ Add Transaction
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white"
                    >
                      ⚙️ Settings
                    </Button>
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {user?.name || user?.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:hidden">
                  <Link href="/transactions">
                    <Button variant="ghost" size="sm">
                      Add
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="ghost" size="sm">
                      Settings
                    </Button>
                  </Link>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  isLoading={isLoggingOut}
                  disabled={isLoggingOut}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
