import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

import type { AcquisitionDataPoint } from "@/entities/acquisition";

interface AcquisitionsTableProps {
  data: AcquisitionDataPoint[];
}

const ROW_HEIGHT = 44;
const VISIBLE_ROWS = 10;

export function AcquisitionsTable({ data }: AcquisitionsTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  if (data.length === 0) {
    return (
      <div role="status" className="py-8 text-center text-muted-foreground">
        <svg
          className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
        <p className="font-medium">No data for selected range</p>
        <p className="mt-1 text-sm">Try adjusting the filters above.</p>
      </div>
    );
  }

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {data.length.toLocaleString()} records · scroll to explore
      </p>

      <div
        className="rounded-md border overflow-hidden"
        role="table"
        aria-label="Acquisitions data"
        aria-rowcount={data.length}
      >
        {/* Sticky header */}
        <div
          role="row"
          className="grid grid-cols-[1fr_auto] bg-muted/60 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none"
        >
          <div role="columnheader" className="px-4 py-3">
            Date &amp; Time
          </div>
          <div role="columnheader" className="px-4 py-3 text-right">
            Detected Sites
          </div>
        </div>

        {/* Virtualised scroll viewport */}
        <div
          ref={parentRef}
          style={{ height: ROW_HEIGHT * VISIBLE_ROWS, overflowY: "auto" }}
          data-testid="acquisitions-table-scroll"
          tabIndex={0}
          aria-label="Scrollable acquisition records"
          className="focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
              position: "relative",
            }}
          >
            {virtualItems.map((virtualRow) => {
              const row = data[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  role="row"
                  aria-rowindex={virtualRow.index + 2}
                  data-index={virtualRow.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="grid grid-cols-[1fr_auto] items-center border-b last:border-b-0 even:bg-muted/30 hover:bg-muted/60 transition-colors cursor-default"
                >
                  <div role="cell" className="px-4 font-mono text-sm truncate">
                    {row.datetime}
                  </div>
                  <div
                    role="cell"
                    className="px-4 text-right font-semibold text-sm tabular-nums"
                  >
                    {row.sites.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
