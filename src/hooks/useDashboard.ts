'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDashboardMetrics } from '@/services/dashboard.service';
import type { DashboardMetrics, DashboardFilters } from '@/modules/dashboard/dashboard.types';

interface UseDashboardReturn {
  data: DashboardMetrics | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboard(
  filters: DashboardFilters = {}
): UseDashboardReturn {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getDashboardMetrics(filters);

      console.log('result', result);

      if (!result.success) {
        setError(result.error || 'Failed to fetch dashboard data');
        setData(null);
        return;
      }

      if (result.data) {
        setData(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

