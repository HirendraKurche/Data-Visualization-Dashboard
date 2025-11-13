'use client';

import { useEffect, useRef, type RefObject } from 'react';

interface UseChartRendererProps<T> {
  canvasRef: RefObject<HTMLCanvasElement>;
  data: T[];
  renderFn: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: T[]) => void;
  dependencies?: unknown[];
}

/**
 * Custom hook for managing canvas chart rendering lifecycle
 * Handles canvas setup, DPR scaling, and render coordination
 */
export function useChartRenderer<T>({
  canvasRef,
  data,
  renderFn,
  dependencies = [],
}: UseChartRendererProps<T>) {
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set display size (css pixels)
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Set actual canvas size in memory (scaled for DPR)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale all drawing operations by the DPR
    ctx.scale(dpr, dpr);

    // Schedule render with requestAnimationFrame for smooth updates
    const render = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      renderFn(ctx, canvas, data);
    };

    // Cancel any pending animation frame before scheduling new one
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(render);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasRef, data, renderFn, ...dependencies]);

  return { canvasRef };
}
