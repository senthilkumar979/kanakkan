'use client';

import { formatCurrency } from '@/utils/currency';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  formatter?: (value: number, name: string) => [string, string];
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const defaultFormatter = (value: number, name: string) => [
    formatCurrency(value),
    name,
  ];

  const format = formatter || defaultFormatter;

  return (
    <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50/50 to-pink-50/50 p-4 shadow-2xl backdrop-blur-sm">
      {label && (
        <p className="mb-3 text-sm font-bold text-purple-900">{label}</p>
      )}
      <div className="space-y-2">
        {payload.map((entry, index) => {
          const [formattedValue, formattedName] = format(
            entry.value,
            entry.name || entry.dataKey
          );
          return (
            <div key={index} className="flex items-center gap-3 rounded-lg bg-white/60 px-2 py-1.5">
              <div
                className="h-4 w-4 rounded-full shadow-md"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {formattedName}:
              </span>
              <span className="text-sm font-bold text-gray-900">
                {formattedValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

