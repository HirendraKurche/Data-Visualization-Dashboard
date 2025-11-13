'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PerformanceMonitor from '@/components/ui/PerformanceMonitor';
import FilterPanel from '@/components/controls/FilterPanel';
import TimeRangeSelector from '@/components/controls/TimeRangeSelector';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import ScatterPlot from '@/components/charts/ScatterPlot';
import Heatmap from '@/components/charts/Heatmap';
import DataTable from '@/components/ui/DataTable';
import type { ChartType } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, List } from 'lucide-react';

export default function DashboardPage() {
  const [view, setView] = useState('grid');
  
  const chartComponents: { [key in ChartType]: React.ComponentType } = {
    line: LineChart,
    bar: BarChart,
    scatter: ScatterPlot,
    heatmap: Heatmap,
  };

  const chartTitles: { [key in ChartType]: string } = {
    line: "Value Over Time",
    bar: "Category Distribution",
    scatter: "Value vs. Intensity",
    heatmap: "Data Point Heatmap",
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-headline font-bold tracking-tight text-primary">
            Realtime Insights Dashboard
          </h1>
          <p className="text-muted-foreground">
            Visualizing 10,000+ data points at 60 FPS.
          </p>
        </div>
        <PerformanceMonitor />
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <FilterPanel />
            <div className='md:ml-auto flex flex-row gap-4 items-center'>
              <TimeRangeSelector />
              <Tabs value={view} onValueChange={setView} className="w-[100px]">
                <TabsList className='grid grid-cols-2 h-9'>
                  <TabsTrigger value="grid" className="h-7"><LayoutGrid size={18} /></TabsTrigger>
                  <TabsTrigger value="table" className="h-7"><List size={18} /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
        </CardContent>
      </Card>
      
      {view === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(Object.keys(chartComponents) as ChartType[]).map((type) => {
            const ChartComponent = chartComponents[type];
            return (
              <Card key={type} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline">{chartTitles[type]}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow h-80">
                  <ChartComponent />
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Live Data Table</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable />
          </CardContent>
        </Card>
      )}

    </main>
  );
}
