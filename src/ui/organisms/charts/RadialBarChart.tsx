'use client';

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { ChartLegend } from './ChartLegend';
import type { ChartDataPoint, ChartColors } from './chart.types';

interface RadialBarChartProps {
  data: ChartDataPoint[];
  dataKey?: string;
  nameKey?: string;
  width?: number;
  height?: number;
  colors?: ChartColors;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

const DEFAULT_COLORS = [
  '#8b5cf6', // purple-500
  '#ec4899', // pink-500
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#a855f7', // violet-500
];

export function RadialBarChartComponent({
  data,
  dataKey = 'value',
  nameKey = 'name',
  width,
  height = 300,
  colors,
  showLegend = true,
  innerRadius = 60,
  outerRadius = 120,
}: RadialBarChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill:
      colors?.[`color${index}`] ||
      DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  const legendItems = chartData.map((item) => ({
    name: item[nameKey] as string,
    color: item.fill as string,
    value: item[dataKey] as number,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width={width || '100%'} height={height}>
        <RadialBarChart
          data={chartData}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar dataKey={dataKey} cornerRadius={4} />
          <Tooltip content={<ChartTooltip />} />
        </RadialBarChart>
      </ResponsiveContainer>
      {showLegend && <ChartLegend items={legendItems} />}
    </div>
  );
}

