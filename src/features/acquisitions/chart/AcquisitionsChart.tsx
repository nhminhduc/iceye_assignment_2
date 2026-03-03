import { useCallback, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DailyAggregation } from "@/entities/acquisition";

import { CHART_COLORS, TOOLTIP_STYLE } from "../chartTheme";

type AcquisitionsChartProps = {
  /** Pre-aggregated daily data (one point per calendar day). */
  data: DailyAggregation[];
  /** Called with the date range when the user drags to zoom */
  onZoom?: (startDate: string, endDate: string) => void;
};

export function AcquisitionsChart({ data, onZoom }: AcquisitionsChartProps) {
  const daily = data;

  // Drag selection state (visual only — zoom applies via onZoom callback)
  const [zoomRight, setZoomRight] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<string | null>(null);

  const handleMouseDown = useCallback(
    (e: { activeLabel?: string | number }) => {
      if (e?.activeLabel != null) setDragStart(String(e.activeLabel));
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: { activeLabel?: string | number }) => {
      if (dragStart && e?.activeLabel != null)
        setZoomRight(String(e.activeLabel));
    },
    [dragStart],
  );

  const handleMouseUp = useCallback(() => {
    if (dragStart && zoomRight && dragStart !== zoomRight) {
      let left = dragStart;
      let right = zoomRight;
      if (left > right) [left, right] = [right, left];

      onZoom?.(left, right);
    }
    setDragStart(null);
    setZoomRight(null);
  }, [dragStart, zoomRight, onZoom]);

  if (daily.length === 0) {
    return (
      <div
        role="status"
        className="flex h-60 sm:h-80 flex-col items-center justify-center gap-2 text-muted-foreground"
      >
        <svg
          className="h-10 w-10 text-muted-foreground/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
        <p className="font-medium">No chart data available</p>
        <p className="text-sm">Adjust filters to see timeline data.</p>
      </div>
    );
  }

  // During a drag, compute the visual selection boundaries
  const selectionLeft =
    dragStart && zoomRight
      ? dragStart < zoomRight
        ? dragStart
        : zoomRight
      : null;
  const selectionRight =
    dragStart && zoomRight
      ? dragStart > zoomRight
        ? dragStart
        : zoomRight
      : null;

  return (
    <div className="space-y-2">
      <div
        className="h-60 sm:h-80 w-full"
        data-testid="acquisitions-chart"
        role="img"
        aria-label={`Line chart showing detected sites over time. ${daily.length} data points from ${daily[0]?.date ?? ""} to ${daily[daily.length - 1]?.date ?? ""}.`}
      >
        <ResponsiveContainer width="100%" height="100%" debounce={200}>
          <LineChart
            data={daily}
            margin={{ top: 5, right: 20, left: 0, bottom: 10 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: CHART_COLORS.text }}
              stroke={CHART_COLORS.grid}
              angle={-40}
              textAnchor="end"
              interval="preserveStartEnd"
            />

            <YAxis
              tick={{ fontSize: 11, fill: CHART_COLORS.text }}
              stroke={CHART_COLORS.grid}
              label={{
                value: "Ore Sites",
                angle: -90,
                position: "insideLeft",
                fill: CHART_COLORS.text,
                fontSize: 12,
              }}
            />

            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value) => [Number(value), "Detected Sites"]}
              labelFormatter={(label) => `Date: ${label}`}
            />

            <Legend verticalAlign="top" height={24} />

            {/* Drag selection highlight */}
            {selectionLeft && selectionRight && (
              <ReferenceArea
                x1={selectionLeft}
                x2={selectionRight}
                strokeOpacity={0.3}
                fill={CHART_COLORS.line}
                fillOpacity={0.15}
              />
            )}

            {/* Connected line with dots */}
            <Line
              type="monotone"
              dataKey="sites"
              name="Detected Sites"
              stroke={CHART_COLORS.line}
              strokeWidth={2}
              connectNulls
              dot={{ r: 2, fill: CHART_COLORS.line }}
              activeDot={{ r: 5, fill: CHART_COLORS.line }}
              isAnimationActive={daily.length <= 300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {daily.length > 1 && (
        <p className="text-xs text-muted-foreground text-center">
          Click and drag on the chart to zoom into a date range
        </p>
      )}
    </div>
  );
}
