import type { DataPoint } from './types';

let lastValue = 50;
const categories = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];

export function generateDataPoint(): DataPoint {
  const timestamp = Date.now();
  
  const change = (Math.random() - 0.5) * 5;
  lastValue = Math.max(0, Math.min(100, lastValue + change));

  const category = categories[Math.floor(Math.random() * categories.length)];
  const intensity = Math.random();

  return {
    timestamp,
    value: lastValue,
    category,
    intensity,
  };
}

export function generateInitialData(count: number): DataPoint[] {
    const data: DataPoint[] = [];
    const now = Date.now();
    for (let i = 0; i < count; i++) {
        const timestamp = now - (count - i) * 1000;
        const change = (Math.random() - 0.5) * 2;
        lastValue = Math.max(0, Math.min(100, lastValue + change));
        const category = categories[Math.floor(Math.random() * categories.length)];
        const intensity = Math.random();
        data.push({ timestamp, value: lastValue, category, intensity });
    }
    return data;
}

export function aggregateData(data: DataPoint[], intervalSeconds: number): DataPoint[] {
    if (intervalSeconds === 0) return data;

    const intervalMs = intervalSeconds * 1000;
    const aggregated: { [key: number]: { sum: number, count: number, intensities: number[], categories: { [key: string]: number } } } = {};

    data.forEach(point => {
        const intervalStart = Math.floor(point.timestamp / intervalMs) * intervalMs;
        if (!aggregated[intervalStart]) {
            aggregated[intervalStart] = { sum: 0, count: 0, intensities: [], categories: {} };
        }
        aggregated[intervalStart].sum += point.value;
        aggregated[intervalStart].count++;
        aggregated[intervalStart].intensities.push(point.intensity);
        aggregated[intervalStart].categories[point.category] = (aggregated[intervalStart].categories[point.category] || 0) + 1;
    });

    return Object.keys(aggregated).map(key => {
        const timestamp = parseInt(key, 10);
        const agg = aggregated[timestamp];
        const mostCommonCategory = Object.keys(agg.categories).reduce((a, b) => agg.categories[a] > agg.categories[b] ? a : b);
        
        return {
            timestamp: timestamp + intervalMs / 2, // Center timestamp in interval
            value: agg.sum / agg.count,
            intensity: agg.intensities.reduce((a, b) => a + b, 0) / agg.intensities.length,
            category: mostCommonCategory
        };
    }).sort((a, b) => a.timestamp - b.timestamp);
}
