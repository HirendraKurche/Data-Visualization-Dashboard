'use client';

import { useContext } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { DataContext } from '@/components/providers/DataProvider';
import { Card } from '@/components/ui/card';

export default function PerformanceMonitor() {
  const { fps, memory } = usePerformanceMonitor();
  const { isConnected, rawData } = useContext(DataContext);

  const getFpsColor = () => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <Card className="p-3 shadow-md">
        <div className="flex items-center space-x-4 text-sm font-code">
            <div className="flex items-center space-x-2">
                <span>CONN:</span>
                <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? 'Connected' : 'Disconnected'}></span>
            </div>
             <div className="flex items-center space-x-2">
                <span>FPS:</span>
                <span className={`font-bold ${getFpsColor()}`}>{fps}</span>
            </div>
            {memory !== null && (
                <div className="hidden sm:flex items-center space-x-2">
                    <span>MEM:</span>
                    <span className="font-bold">{memory.toFixed(1)} MB</span>
                </div>
            )}
            <div className="hidden sm:flex items-center space-x-2">
                <span>DATA:</span>
                <span className="font-bold">{rawData.length.toLocaleString()}</span>
            </div>
        </div>
    </Card>
  );
}
