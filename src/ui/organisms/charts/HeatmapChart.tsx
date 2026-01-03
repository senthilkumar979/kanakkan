'use client';

import type { HeatmapDataPoint } from './chart.types';
import { formatCurrency } from '@/utils/currency';

interface HeatmapChartProps {
  data: HeatmapDataPoint[];
  width?: number;
  height?: number;
  colorScale?: {
    min: string;
    max: string;
  };
}

function getColorForValue(
  value: number,
  min: number,
  max: number,
  colorScale: { min: string; max: string }
): string {
  if (max === min) return colorScale.min;
  const ratio = (value - min) / (max - min);
  return ratio < 0.5 ? colorScale.min : colorScale.max;
}

export function HeatmapChart({
  data,
  width,
  height = 300,
  colorScale = {
    min: 'hsl(var(--color-muted))',
    max: 'hsl(var(--color-primary))',
  },
}: HeatmapChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const weeks = Array.from(new Set(data.map((d) => d.week))).sort();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const heatmapData = days.map((day) => ({
    day,
    ...weeks.reduce(
      (acc, week) => {
        const point = data.find((d) => d.day === day && d.week === week);
        acc[week] = point?.value || 0;
        return acc;
      },
      {} as Record<string, number>
    ),
  }));

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ width: width || '100%', height }}>
        <div className="grid grid-cols-7 gap-1">
          <div />
          {weeks.map((week) => (
            <div key={week} className="text-center text-xs text-muted-foreground">
              {week}
            </div>
          ))}
          {days.map((day) => (
            <div key={day} className="contents">
              <div className="flex items-center text-xs text-muted-foreground">
                {day}
              </div>
              {weeks.map((week) => {
                const point = data.find((d) => d.day === day && d.week === week);
                const value = point?.value || 0;
                const color = getColorForValue(value, minValue, maxValue, colorScale);
                return (
                  <div
                    key={`${day}-${week}`}
                    className="aspect-square rounded border"
                    style={{ backgroundColor: color }}
                    title={`${day} ${week}: ${formatCurrency(value)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

