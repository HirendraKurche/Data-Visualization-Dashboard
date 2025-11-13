import { aggregateData } from './dataGenerator';
import type { DataPoint, FilterOptions } from './types';

self.onmessage = (event: MessageEvent<{ rawData: DataPoint[], filters: FilterOptions }>) => {
  const { rawData, filters } = event.data;

  const filtered = rawData.filter(
    d => d.value >= filters.valueRange[0] && d.value <= filters.valueRange[1]
  );

  const aggregationSeconds = {
    'none': 0,
    '1s': 1,
    '5s': 5,
    '10s': 10,
    '1m': 60,
    '5m': 300,
    '1h': 3600,
  };
  
  const seconds = aggregationSeconds[filters.aggregation];

  if (seconds > 0) {
    const aggregatedData = aggregateData(filtered, seconds);
    postMessage(aggregatedData);
  } else {
    postMessage(filtered);
  }
};

// This is needed to make TypeScript happy that this is a module.
export {};
