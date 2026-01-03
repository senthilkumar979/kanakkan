'use client';

import { useMemo } from 'react';
import type { CalendarDataPoint } from './chart.types';
import { ChartTooltip } from './ChartTooltip';
import { formatCurrency } from '@/utils/currency';

interface CalendarChartProps {
  data: CalendarDataPoint[];
  width?: number;
  height?: number;
  colorScale?: {
    min: string;
    max: string;
  };
  year?: number;
}

export function CalendarChart({
  data,
  width,
  height = 200,
  colorScale = {
    min: 'hsl(var(--color-muted))',
    max: 'hsl(var(--color-primary))',
  },
  year = new Date().getFullYear(),
}: CalendarChartProps) {
  const calendarData = useMemo(() => {
    const dataMap = new Map(
      data.map((point) => [point.date, point.value])
    );

    const daysInYear = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toISOString().split('T')[0];
      daysInYear.push({
        date: dateStr,
        value: dataMap.get(dateStr) || 0,
        day: date.getDay(),
        week: getWeekNumber(date),
        month: date.getMonth(),
      });
    }

    return daysInYear;
  }, [data, year]);

  const values = calendarData.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  function getColorForValue(value: number): string {
    if (maxValue === minValue) return colorScale.min;
    const ratio = (value - minValue) / (maxValue - minValue);
    return ratio < 0.5 ? colorScale.min : colorScale.max;
  }

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const weeks = Array.from(
    new Set(calendarData.map((d) => d.week))
  ).sort();

  if (calendarData.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="mb-2 flex items-center gap-2">
          {months.map((month, index) => {
            const monthDays = calendarData.filter((d) => d.month === index);
            const firstDay = monthDays[0]?.day || 0;
            return (
              <div
                key={month}
                className="text-xs text-muted-foreground"
                style={{ marginLeft: index === 0 ? `${firstDay * 12}px` : '0' }}
              >
                {month}
              </div>
            );
          })}
        </div>
        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div
              key={index}
              className="text-center text-xs text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {calendarData.map((day, index) => {
            const color = getColorForValue(day.value);
            return (
              <div
                key={day.date}
                className="aspect-square rounded border"
                style={{ backgroundColor: color }}
                title={`${new Date(day.date).toLocaleDateString()}: ${formatCurrency(day.value)}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

