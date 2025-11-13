'use client';

import { useState, useEffect, useRef } from 'react';
import type { DataPoint } from '@/lib/types';
import { generateInitialData } from '@/lib/dataGenerator';

const MAX_DATA_POINTS = 10000;
const BATCH_UPDATE_INTERVAL_MS = 16; // ~60fps

export function useDataStream() {
  const [data, setData] = useState<DataPoint[]>(() => generateInitialData(1000));
  const [isConnected, setIsConnected] = useState(false);
  const buffer = useRef<DataPoint[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/data');
    setIsConnected(true);

    eventSource.onmessage = (event) => {
      try {
        if (event.data) {
          const newDataPoint: DataPoint = JSON.parse(event.data);
          buffer.current.push(newDataPoint);
        }
      } catch (error) {
        console.error('Failed to parse incoming data:', error);
      }
    };

    eventSource.onerror = () => {
      console.error('Data stream error. Attempting to reconnect...');
      setIsConnected(false);
      eventSource.close();
    };
    
    const updateInterval = setInterval(() => {
      if (buffer.current.length > 0) {
        setData(prevData => {
          const combined = [...prevData, ...buffer.current];
          buffer.current = [];
          const trimmed = combined.length > MAX_DATA_POINTS 
            ? combined.slice(combined.length - MAX_DATA_POINTS) 
            : combined;
          return trimmed;
        });
      }
    }, BATCH_UPDATE_INTERVAL_MS);


    return () => {
      eventSource.close();
      clearInterval(updateInterval);
      setIsConnected(false);
    };
  }, []);

  return { data, isConnected };
}
