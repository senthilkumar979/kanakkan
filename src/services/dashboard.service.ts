import type { DashboardMetrics, DashboardFilters } from '@/modules/dashboard/dashboard.types';

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
      // Redirect to login if unauthorized and clear tokens
      if (response.status === 401) {
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          const { clearTokens } = await import('@/utils/storage');
          clearTokens();
          window.location.href = '/login';
        }
      }
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

function buildQueryString(filters: DashboardFilters): string {
  const params = new URLSearchParams();
  if (filters.startDate) {
    params.append('startDate', filters.startDate.toISOString());
  }
  if (filters.endDate) {
    params.append('endDate', filters.endDate.toISOString());
  }
  return params.toString();
}

export async function getDashboardMetrics(
  filters: DashboardFilters = {}
): Promise<ApiResponse<DashboardMetrics>> {
  const queryString = buildQueryString(filters);
  const url = `/api/dashboard/metrics${queryString ? `?${queryString}` : ''}`;
  return apiRequest<DashboardMetrics>(url);
}

