'use client';

import React, { useRef, useEffect, useContext, useState } from 'react';
import { DataContext } from '@/components/providers/DataProvider';
import { drawAxesAndGrid, getViewport, mapDataToCoords } from '@/lib/canvasUtils';

let primaryColor: string, accentColor: string;
const updateColors = () => {
    if (typeof window === 'undefined') return;
    primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
};

const LineChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { processedData: data, viewport, setViewport } = useContext(DataContext);
  const [isClient, setIsClient] = useState(false);
  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);
    updateColors();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setViewport(v => ({ ...v, zoom: Math.max(1, v.zoom * zoomFactor) }));
    };

    const handleMouseDown = (e: MouseEvent) => {
      isPanning.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isPanning.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning.current) return;
      if (data.length < 2) return; // Prevent panning if there's no data
      
      const dx = e.clientX - lastMousePos.current.x;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      setViewport(v => {
        const newPanX = v.pan.x - dx / v.zoom;
        // Clamp pan so you can't pan beyond the data
        const maxPan = (data[data.length-1].timestamp - data[0].timestamp) * (1 - 1/v.zoom)
        return { ...v, pan: { x: Math.max(0, Math.min(newPanX, maxPan)) } };
      });
    };
    
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };

  }, [data, setViewport]);

  useEffect(() => {
    if (!isClient || data.length < 2) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.scale(dpr, dpr);
    
    const initialViewport = getViewport(data);
    const chartViewport = {
      minX: initialViewport.minX + viewport.pan.x,
      maxX: initialViewport.minX + viewport.pan.x + (initialViewport.maxX - initialViewport.minX) / viewport.zoom,
      minY: 0,
      maxY: 100,
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxesAndGrid(ctx, rect.width, rect.height, chartViewport);
    
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = `hsl(${primaryColor})`;
    
    // Find first visible point
    const firstVisibleIndex = data.findIndex(d => d.timestamp >= chartViewport.minX);
    const firstIndex = Math.max(0, firstVisibleIndex - 1);
    
    if (firstIndex >= data.length) return; // No data in view

    const firstPoint = mapDataToCoords(data[firstIndex], chartViewport, rect.width, rect.height);
    ctx.moveTo(firstPoint.x, firstPoint.y);

    for (let i = firstIndex + 1; i < data.length; i++) {
      const point = data[i];
      const { x, y } = mapDataToCoords(point, chartViewport, rect.width, rect.height);
      ctx.lineTo(x, y);

      if (point.timestamp > chartViewport.maxX) {
        // Stop drawing if we've gone past the viewport
        break;
      }
    }
    ctx.stroke();
    
    const lastPointInView = data.find(d => d.timestamp <= chartViewport.maxX);
    if(lastPointInView) {
        const lastPointCoords = mapDataToCoords(lastPointInView, chartViewport, rect.width, rect.height);
        ctx.beginPath();
        ctx.arc(lastPointCoords.x, lastPointCoords.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${accentColor})`;
        ctx.fill();
    }
    
  }, [data, isClient, viewport]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />;
};

export default React.memo(LineChart);
