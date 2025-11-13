'use client';

import React, { useContext } from 'react';
import { DataContext } from '@/components/providers/DataProvider';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function FilterPanel() {
  const { filters, setFilters, isPending } = useContext(DataContext);

  const handleValueChange = (newValue: [number, number]) => {
    setFilters({ valueRange: newValue });
  };

  return (
    <div className={`flex-grow w-full md:w-auto transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex flex-col space-y-2">
            <Label htmlFor="value-range" className="text-sm font-medium">
                Value Range: {filters.valueRange[0]} - {filters.valueRange[1]}
            </Label>
            <Slider
                id="value-range"
                min={0}
                max={100}
                step={1}
                value={filters.valueRange}
                onValueChange={handleValueChange}
                className="w-full md:w-64"
                disabled={isPending}
            />
        </div>
    </div>
  );
}
