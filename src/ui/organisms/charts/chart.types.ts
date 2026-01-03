export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TimeSeriesDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface HeatmapDataPoint {
  day: string;
  week: string;
  value: number;
}

export interface SankeyNode {
  id: string;
  name: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface CalendarDataPoint {
  date: string;
  value: number;
}

export interface ChartColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  [key: string]: string | undefined;
}

export interface BaseChartProps {
  data: ChartDataPoint[] | TimeSeriesDataPoint[] | HeatmapDataPoint[] | CalendarDataPoint[];
  width?: number;
  height?: number;
  colors?: ChartColors;
}

