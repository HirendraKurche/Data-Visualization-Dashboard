'use client';

import React, { useRef, useEffect, useContext, useState, useMemo } from 'react';
import { DataContext } from '@/components/providers/DataProvider';

let primaryColor: string;
const updateColors = () => {
    if (typeof window === 'undefined') return;
    primaryColor = `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()})`;
};


const BarChart = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { processedData: data } = useContext(DataContext);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        updateColors();
    }, []);

    const categoryCounts = useMemo(() => {
        const counts = new Map<string, number>();
        data.forEach(d => {
            counts.set(d.category, (counts.get(d.category) || 0) + 1);
        });
        return Array.from(counts.entries()).sort((a,b) => b[1] - a[1]);
    }, [data]);


    useEffect(() => {
        if (!isClient || categoryCounts.length === 0) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(dpr, dpr);

        const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };
        const chartWidth = rect.width - PADDING.left - PADDING.right;
        const chartHeight = rect.height - PADDING.top - PADDING.bottom;

        const maxCount = Math.max(...categoryCounts.map(c => c[1]));
        const barWidth = chartWidth / categoryCounts.length * 0.7;
        const barSpacing = chartWidth / categoryCounts.length * 0.3;

        ctx.clearRect(0, 0, rect.width, rect.height);

        // Draw Axes
        ctx.beginPath();
        ctx.strokeStyle = 'hsl(var(--muted-foreground))';
        ctx.moveTo(PADDING.left, PADDING.top);
        ctx.lineTo(PADDING.left, rect.height - PADDING.bottom);
        ctx.lineTo(rect.width - PADDING.right, rect.height - PADDING.bottom);
        ctx.stroke();

        ctx.fillStyle = primaryColor;
        ctx.font = '12px Inter';

        categoryCounts.forEach(([category, count], index) => {
            const barHeight = (count / maxCount) * chartHeight;
            const x = PADDING.left + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = rect.height - PADDING.bottom - barHeight;

            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw labels
            ctx.save();
            ctx.translate(x + barWidth / 2, rect.height - PADDING.bottom + 5);
            ctx.rotate(Math.PI / 4);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'hsl(var(--foreground))';
            ctx.fillText(category, 0, 0);
            ctx.restore();
        });
        
    }, [categoryCounts, isClient]);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default React.memo(BarChart);
