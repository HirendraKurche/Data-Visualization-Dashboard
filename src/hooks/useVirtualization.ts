'use client';

import { useState, useMemo, type RefObject, useLayoutEffect, useEffect } from 'react';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface UseVirtualizationProps<T> {
  containerRef: RefObject<HTMLElement>;
  itemHeight: number;
  totalItems: number;
  data: T[];
  overscan?: number;
}

export function useVirtualization<T>({
  containerRef,
  itemHeight,
  totalItems,
  data,
  overscan = 5,
}: UseVirtualizationProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [containerRef]);

  const { virtualItems, totalHeight, paddingTop } = useMemo(() => {
    const containerHeight = containerRef.current?.clientHeight || 0;
    const totalHeight = itemHeight * totalItems;

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleItemCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(totalItems - 1, startIndex + visibleItemCount + overscan * 2);

    const virtualItems = data.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      _index: startIndex + index,
    }));
    
    const paddingTop = startIndex * itemHeight;

    return { virtualItems, totalHeight, paddingTop };
  }, [scrollTop, itemHeight, totalItems, data, overscan, containerRef.current?.clientHeight]);

  return {
    virtualItems,
    totalHeight,
    paddingTop,
  };
}
