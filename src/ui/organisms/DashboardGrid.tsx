'use client';

import { StatCards } from './StatCards';
import { ChartCards } from './ChartCards';
import { FilterPanel } from './FilterPanel';
import type { DashboardMetrics, DashboardFilters } from '@/modules/dashboard/dashboard.types';

interface DashboardGridProps {
  data: DashboardMetrics;
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  onResetFilters: () => void;
}

export function DashboardGrid({
  data,
  filters,
  onFiltersChange,
  onResetFilters,
}: DashboardGridProps) {
  return (
    <div className="space-y-8">
      <FilterPanel
        filters={filters}
        onFiltersChange={onFiltersChange}
        onReset={onResetFilters}
      />

      <StatCards
        totalSpend={data.totalSpend}
        incomeVsExpense={data.incomeVsExpense}
      />

      <div>
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Analytics & Insights</h2>
        <ChartCards
          categoryBreakdown={data.categoryBreakdown}
          subcategoryBreakdown={data.subcategoryBreakdown}
          moneyModeUsage={data.moneyModeUsage}
          cardSpend={data.cardSpend}
          incomeVsExpense={data.incomeVsExpense}
          incomeVsExpenseByDate={data.incomeVsExpenseByDate}
        />
      </div>
    </div>
  );
}

