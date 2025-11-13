'use client';

import React, { useRef, useEffect, useContext, useState, useMemo } from 'react';
import { DataContext } from '@/components/providers/DataProvider';

const Heatmap = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { processedData: data } = useContext(DataContext);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const grid = useMemo(() => {
        const gridSize = 20;
        const newGrid: number[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
        if (data.length === 0) return { cells: newGrid, max: 0 };
        
        const timeSpan = data[data.length-1].timestamp - data[0].timestamp;
        
        data.forEach(point => {
            const xIndex = Math.floor(gridSize * (point.timestamp - data[0].timestamp) / timeSpan);
            const yIndex = Math.floor(gridSize * point.value / 100);

            if (xIndex >= 0 && xIndex < gridSize && yIndex >= 0 && yIndex < gridSize) {
                newGrid[yIndex][xIndex]++;
            }
        });

        const max = Math.max(...newGrid.flat());
        return { cells: newGrid, max };

    }, [data]);


    useEffect(() => {
        if (!isClient || grid.max === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(dpr, dpr);

        const cellWidth = rect.width / grid.cells[0].length;
        const cellHeight = rect.height / grid.cells.length;

        ctx.clearRect(0, 0, rect.width, rect.height);

        for (let y = 0; y < grid.cells.length; y++) {
            for (let x = 0; x < grid.cells[y].length; x++) {
                const value = grid.cells[y][x];
                if (value === 0) continue;
                
                const opacity = value / grid.max;
                // Using primary color for heatmap
                ctx.fillStyle = `hsla(var(--primary), ${opacity})`; 
                ctx.fillRect(x * cellWidth, (grid.cells.length - 1 - y) * cellHeight, cellWidth, cellHeight);
            }
        }
    }, [grid, isClient]);


    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default React.memo(Heatmap);
