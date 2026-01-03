'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { ChartLegend } from './ChartLegend';
import type { TimeSeriesDataPoint, ChartColors } from './chart.types';
import { formatCurrency } from '@/utils/currency';

interface StackedAreaChartProps {
  data: TimeSeriesDataPoint[];
  dataKeys: string[];
  width?: number;
  height?: number;
  colors?: ChartColors;
  showLegend?: boolean;
}

const DEFAULT_COLORS = [
  '#8b5cf6', // purple-500
  '#ec4899', // pink-500
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
];

export function StackedAreaChart({
  data,
  dataKeys,
  width,
  height = 300,
  colors,
  showLegend = true,
}: StackedAreaChartProps) {
  const chartColors = dataKeys.map((_, index): string => {
    const customColor = colors?.[`color${index}`];
    if (customColor && typeof customColor === 'string') {
      return customColor;
    }
    return DEFAULT_COLORS[index % DEFAULT_COLORS.length]!;
  });

  // Calculate totals for each dataKey
  const totals = dataKeys.reduce(
    (acc, key) => {
      acc[key] = data.reduce((sum, item) => {
        const value = item[key];
        return sum + (typeof value === 'number' ? value : 0);
      }, 0);
      return acc;
    },
    {} as Record<string, number>
  );

  // Format legend labels (capitalize first letter, add emoji)
  const formatLegendName = (key: string): string => {
    const formatted = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    const emojiMap: Record<string, string> = {
      income: '💰',
      expense: '💸',
    };
    return `${emojiMap[key.toLowerCase()] || ''} ${formatted}`.trim();
  };

  const legendItems = dataKeys.map((key, index) => {
    const color =
      chartColors[index] ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]!;
    return {
      name: formatLegendName(key),
      color,
      value: totals[key] || 0,
    };
  });

  return (
    <div className="w-full">
      <ResponsiveContainer width={width || '100%'} height={height}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            {dataKeys.map((key, index) => (
              <linearGradient
                key={key}
                id={`color${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={chartColors[index]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartColors[index]}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            className="text-xs text-muted-foreground"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis
            className="text-xs text-muted-foreground"
            tickFormatter={(value) =>
              formatCurrency(value, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            }
          />
          <Tooltip content={<ChartTooltip />} />
          {dataKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={chartColors[index]}
              fill={`url(#color${index})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      {showLegend && <ChartLegend items={legendItems} />}
    </div>
  );
}
