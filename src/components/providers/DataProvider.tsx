'use client';

import React, { createContext, useState, useTransition, useEffect } from 'react';
import { useDataStream } from '@/hooks/useDataStream';
import type { DataPoint, FilterOptions, ViewportOptions } from '@/lib/types';


interface DataContextType {
  rawData: DataPoint[];
  processedData: DataPoint[];
  filters: FilterOptions;
  setFilters: (filters: Partial<FilterOptions>) => void;
  viewport: ViewportOptions;
  setViewport: React.Dispatch<React.SetStateAction<ViewportOptions>>;
  isPending: boolean;
  isConnected: boolean;
}

export const DataContext = createContext<DataContextType>({
  rawData: [],
  processedData: [],
  filters: { valueRange: [0, 100], aggregation: 'none' },
  setFilters: () => {},
  viewport: { zoom: 1, pan: { x: 0 } },
  setViewport: () => {},
  isPending: false,
  isConnected: false,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { data: rawData, isConnected } = useDataStream();
  const [processedData, setProcessedData] = useState<DataPoint[]>([]);
  const [filters, setFiltersState] = useState<FilterOptions>({
    valueRange: [0, 100],
    aggregation: 'none',
  });
  const [viewport, setViewport] = useState<ViewportOptions>({ zoom: 1, pan: { x: 0 } });
  const [isPending, startTransition] = useTransition();

  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    // Correctly instantiate the worker with a static path.
    const workerInstance = new Worker(new URL('../../lib/data.worker.ts', import.meta.url));
    setWorker(workerInstance);

    workerInstance.onmessage = (event) => {
      setProcessedData(event.data);
    };

    return () => {
      workerInstance.terminate();
    };
  }, []);

  useEffect(() => {
    if (worker) {
      worker.postMessage({
        rawData,
        filters,
      });
    }
  }, [rawData, filters, worker]);


  const setFilters = (newFilters: Partial<FilterOptions>) => {
    startTransition(() => {
      setFiltersState(prev => ({ ...prev, ...newFilters }));
    });
  };

  const value = {
    rawData,
    processedData,
    filters,
    setFilters,
    viewport,
    setViewport,
    isPending,
    isConnected,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
