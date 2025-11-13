'use client';

import type { DataPoint } from "./types";

const AXIS_COLOR = 'hsl(var(--muted-foreground))';
const GRID_COLOR = 'hsl(var(--border))';
const TEXT_COLOR = 'hsl(var(--foreground))';
const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };

export interface Viewport {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export function getViewport(data: DataPoint[]): Viewport {
    if (data.length === 0) return { minX: 0, maxX: 1, minY: 0, maxY: 100 };
    const timestamps = data.map(d => d.timestamp);
    
    return {
        minX: timestamps[0],
        maxX: timestamps[timestamps.length-1],
        minY: 0,
        maxY: 100
    };
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    if (inMax === inMin) return outMin; // Avoid division by zero
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function drawAxesAndGrid(ctx: CanvasRenderingContext2D, width: number, height: number, viewport: Viewport) {
    ctx.save();
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw Grid and Y-axis labels
    const yAxisTicks = 5;
    for (let i = 0; i <= yAxisTicks; i++) {
        const value = viewport.minY + (i / yAxisTicks) * (viewport.maxY - viewport.minY);
        const y = mapRange(value, viewport.minY, viewport.maxY, height - PADDING.bottom, PADDING.top);

        // Grid line
        ctx.beginPath();
        ctx.strokeStyle = GRID_COLOR;
        ctx.lineWidth = 1;
        ctx.moveTo(PADDING.left, y);
        ctx.lineTo(width - PADDING.right, y);
        ctx.stroke();

        // Y-axis label
        ctx.fillStyle = TEXT_COLOR;
        ctx.textAlign = 'right';
        ctx.fillText(value.toFixed(0), PADDING.left - 8, y);
    }

    // Draw Grid and X-axis labels
    const xAxisTicks = 5;
    const timeSpan = viewport.maxX - viewport.minX;
    for (let i = 0; i <= xAxisTicks; i++) {
        const value = viewport.minX + (i / xAxisTicks) * timeSpan;
        const x = mapRange(value, viewport.minX, viewport.maxX, PADDING.left, width - PADDING.right);

        // Grid line
        ctx.beginPath();
        ctx.strokeStyle = GRID_COLOR;
        ctx.lineWidth = 1;
        ctx.moveTo(x, PADDING.top);
        ctx.lineTo(x, height - PADDING.bottom);
        ctx.stroke();

        // X-axis label
        ctx.fillStyle = TEXT_COLOR;
        ctx.textAlign = 'center';
        ctx.fillText(new Date(value).toLocaleTimeString(), x, height - PADDING.bottom + 16);
    }

    // Draw axes lines
    ctx.beginPath();
    ctx.strokeStyle = AXIS_COLOR;
    ctx.lineWidth = 1;
    // Y-axis
    ctx.moveTo(PADDING.left, PADDING.top);
    ctx.lineTo(PADDING.left, height - PADDING.bottom);
    // X-axis
    ctx.moveTo(PADDING.left, height - PADDING.bottom);
    ctx.lineTo(width - PADDING.right, height - PADDING.bottom);
    ctx.stroke();

    ctx.restore();
}

export function mapDataToCoords(point: DataPoint, viewport: Viewport, width: number, height: number) {
    const x = mapRange(point.timestamp, viewport.minX, viewport.maxX, PADDING.left, width - PADDING.right);
    const y = mapRange(point.value, viewport.minY, viewport.maxY, height - PADDING.bottom, PADDING.top);
    return { x, y };
}
