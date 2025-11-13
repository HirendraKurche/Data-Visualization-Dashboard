'use client';

import React, { useContext } from 'react';
import { DataContext } from '@/components/providers/DataProvider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AggregationOptions } from '@/lib/types';

export default function TimeRangeSelector() {
  const { filters, setFilters, isPending } = useContext(DataContext);

  const handleAggregationChange = (value: AggregationOptions) => {
    setFilters({ aggregation: value });
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="aggregation-select" className="text-sm font-medium">
        Aggregate
      </Label>
      <Select
        value={filters.aggregation}
        onValueChange={handleAggregationChange}
        disabled={isPending}
      >
        <SelectTrigger id="aggregation-select" className="w-[120px]">
          <SelectValue placeholder="Aggregation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="1s">Every 1s</SelectItem>
          <SelectItem value="5s">Every 5s</SelectItem>
          <SelectItem value="10s">Every 10s</SelectItem>
          <SelectItem value="1m">Every 1m</SelectItem>
          <SelectItem value="5m">Every 5m</SelectItem>
          <SelectItem value="1h">Every 1h</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
