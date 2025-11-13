'use client';

import React, { useRef, useEffect, useContext, useState } from 'react';
import { DataContext } from '@/components/providers/DataProvider';

let accentColor: string;
const updateColors = () => {
    if (typeof window === 'undefined') return;
    accentColor = `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()})`;
};


const ScatterPlot = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { processedData: data } = useContext(DataContext);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        updateColors();
    }, []);

    useEffect(() => {
        if (!isClient || data.length === 0) return;

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
        const yAxisMax = 100;
        const xAxisMax = 1;

        ctx.clearRect(0, 0, rect.width, rect.height);
        
        // A simplified axis drawing
        ctx.beginPath();
        ctx.strokeStyle = 'hsl(var(--muted-foreground))';
        ctx.moveTo(PADDING.left, PADDING.top);
        ctx.lineTo(PADDING.left, rect.height - PADDING.bottom);
        ctx.lineTo(rect.width - PADDING.right, rect.height - PADDING.bottom);
        ctx.stroke();

        ctx.fillStyle = 'hsl(var(--foreground))';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Intensity', rect.width / 2, rect.height - PADDING.bottom + 25);
        ctx.save();
        ctx.translate(PADDING.left - 25, rect.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Value', 0, 0);
        ctx.restore();


        data.forEach(point => {
            const x = PADDING.left + (point.intensity / xAxisMax) * (rect.width - PADDING.left - PADDING.right);
            const y = (rect.height - PADDING.bottom) - (point.value / yAxisMax) * (rect.height - PADDING.top - PADDING.bottom);
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = accentColor;
            ctx.globalAlpha = 0.5;
            ctx.fill();
            ctx.globalAlpha = 1;
        });

    }, [data, isClient]);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default React.memo(ScatterPlot);
