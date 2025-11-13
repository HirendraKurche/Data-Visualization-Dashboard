'use client';

import React, { useContext, useRef } from 'react';
import { DataContext } from '@/components/providers/DataProvider';
import { useVirtualization } from '@/hooks/useVirtualization';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

const ROW_HEIGHT = 48; // px, corresponds to p-4 in TableCell and h-12 in TableRow

export default function DataTable() {
  const { processedData } = useContext(DataContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const { virtualItems, totalHeight, paddingTop } = useVirtualization({
    containerRef,
    itemHeight: ROW_HEIGHT,
    totalItems: processedData.length,
    data: processedData,
  });

  return (
    <div ref={containerRef} className="h-[60vh] overflow-auto border rounded-lg relative">
      <div style={{ height: `${totalHeight}px`, paddingTop: `${paddingTop}px` }}>
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="w-[200px]">Timestamp</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Intensity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {virtualItems.map((item) => (
              <TableRow key={item.timestamp} style={{ height: `${ROW_HEIGHT}px` }}>
                <TableCell className="font-medium font-code">
                  {format(new Date(item.timestamp), 'HH:mm:ss.SSS')}
                </TableCell>
                <TableCell>{item.value.toFixed(2)}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">{item.intensity.toFixed(4)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
