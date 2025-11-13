'use client';

import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory: number | null;
}

export function usePerformanceMonitor(): PerformanceMetrics {
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState<number | null>(null);

  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let animationFrameId: number;

    const loop = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
        
        // Check for memory info (not available in all browsers/contexts)
        const memoryInfo = (performance as Performance & {
          memory?: { usedJSHeapSize: number };
        }).memory;
        if (memoryInfo && memoryInfo.usedJSHeapSize) {
          setMemory(memoryInfo.usedJSHeapSize / (1024 * 1024)); // in MB
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return { fps, memory };
}
