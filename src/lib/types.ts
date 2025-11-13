export type DataPoint = {
  timestamp: number;
  value: number;
  category: string;
  intensity: number;
};

export type AggregationOptions = 'none' | '1s' | '5s' | '10s' | '1m' | '5m' | '1h';

export type FilterOptions = {
  valueRange: [number, number];
  aggregation: AggregationOptions;
};

export type ViewportOptions = {
  zoom: number; // 1 = 100%
  pan: { x: number }; // pan offset
};

export type ChartType = 'line' | 'bar' | 'scatter' | 'heatmap';
