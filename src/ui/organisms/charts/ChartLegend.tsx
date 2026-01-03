'use client';

import { formatCurrency } from '@/utils/currency';

interface LegendItem {
  name: string;
  color: string;
  value?: number;
}

interface ChartLegendProps {
  items: LegendItem[];
  formatter?: (value: number) => string;
}

export function ChartLegend({ items, formatter }: ChartLegendProps) {
  const defaultFormatter = (value: number) => formatCurrency(value);

  const format = formatter || defaultFormatter;

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 p-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 rounded-lg bg-white/60 px-3 py-1.5 shadow-sm">
          <div
            className="h-4 w-4 rounded-full shadow-md"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm font-semibold text-gray-700">{item.name}</span>
          {item.value !== undefined && (
            <span className="text-sm font-bold text-gray-900">
              {format(item.value)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

