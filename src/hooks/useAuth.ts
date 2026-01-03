'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAccessToken, clearTokens } from '@/utils/storage';
import type { UserPayload } from '@/modules/auth/auth.types';

interface AuthState {
  isAuthenticated: boolean;
  user: UserPayload | null;
  isLoading: boolean;
}

let authStateListeners: Set<() => void> = new Set();

function checkAuthState(): AuthState {
  const token = getAccessToken();

  if (!token) {
    return {
      isAuthenticated: false,
      user: null,
      isLoading: false,
    };
  }

  try {
    const payload = parseJwt(token);
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      clearTokens();
      return {
        isAuthenticated: false,
        user: null,
        isLoading: false,
      };
    }

    return {
      isAuthenticated: true,
      user: payload,
      isLoading: false,
    };
  } catch {
    // Token is invalid, clear it
    clearTokens();
    return {
      isAuthenticated: false,
      user: null,
      isLoading: false,
    };
  }
}

function notifyAuthStateChange(): void {
  authStateListeners.forEach((listener) => listener());
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  const updateAuthState = useCallback(() => {
    setAuthState(checkAuthState());
  }, []);

  useEffect(() => {
    // Initial check
    updateAuthState();

    // Only set up event listeners in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Listen for storage changes (when tokens are set/cleared)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        updateAuthState();
      }
    };

    // Listen for custom auth events
    const handleAuthChange = () => {
      updateAuthState();
    };

    // Add listener to set
    authStateListeners.add(handleAuthChange);

    // Listen to storage events (for cross-tab updates)
    window.addEventListener('storage', handleStorageChange);

    // Listen to custom auth event (for same-tab updates)
    window.addEventListener('auth-state-changed', handleAuthChange);

    return () => {
      authStateListeners.delete(handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, [updateAuthState]);

  return authState;
}

// Export function to manually trigger auth state update
export function refreshAuthState(): void {
  notifyAuthStateChange();
}

function parseJwt(token: string): UserPayload {
  try {
    const base64Url = token.split('.')[1];
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
    throw new Error('Invalid token');
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    const decoded = JSON.parse(jsonPayload);
    const exp = decoded.exp;

    if (!exp) {
      return true; // No expiration means invalid token
    }

    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  } catch {
    return true; // If we can't parse, consider it expired
  }
}

