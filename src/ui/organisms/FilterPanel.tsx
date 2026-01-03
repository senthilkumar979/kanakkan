'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/ui/atoms/Button';
import { Input } from '@/ui/atoms/Input';
import { Label } from '@/ui/atoms/Label';
import type { DashboardFilters } from '@/modules/dashboard/dashboard.types';

interface FilterPanelProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  onReset: () => void;
}

function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const date = time.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="flex flex-col items-end">
      <div className="font-mono text-2xl font-bold text-slate-900">
        {hours}:{minutes}:{seconds}
      </div>
      <div className="text-xs font-medium text-slate-500">{date}</div>
    </div>
  );
}

export function FilterPanel({
  filters,
  onFiltersChange,
  onReset,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [startDate, setStartDate] = useState(
    filters.startDate?.toISOString().split('T')[0] || ''
  );
  const [endDate, setEndDate] = useState(
    filters.endDate?.toISOString().split('T')[0] || ''
  );

  useEffect(() => {
    setStartDate(filters.startDate?.toISOString().split('T')[0] || '');
    setEndDate(filters.endDate?.toISOString().split('T')[0] || '');
  }, [filters.startDate, filters.endDate]);

  const handleApply = () => {
    onFiltersChange({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    onReset();
  };

  const handleQuickFilter = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);

    onFiltersChange({
      startDate: start,
      endDate: end,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        {isExpanded ? (
          <div className="flex flex-1 flex-wrap items-end gap-4">
            <button
              onClick={() => setIsExpanded(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <Label htmlFor="startDate" className="mb-1 text-xs font-medium text-slate-600">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="endDate" className="mb-1 text-xs font-medium text-slate-600">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600">Quick:</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickFilter(7)}
                  className="border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-700"
                >
                  7D
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickFilter(30)}
                  className="border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-700"
                >
                  30D
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickFilter(90)}
                  className="border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-700"
                >
                  90D
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickFilter(365)}
                  className="border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-700"
                >
                  Year
                </Button>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button 
                onClick={handleApply} 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-sm text-white shadow-md hover:shadow-lg"
              >
                Apply
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
              >
                Reset
              </Button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => setIsExpanded(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <DigitalClock />
          </>
        )}
      </div>
    </div>
  );
}

