import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DailyAggregation } from "@/entities/acquisition";

import { CHART_COLORS, TOOLTIP_STYLE } from "../chartTheme";
import { buildHistogram } from "./buildHistogram";

interface AcquisitionsHistogramProps {
  /** Pre-aggregated daily data (one point per calendar day). */
  data: DailyAggregation[];
}

const AcquisitionsHistogram: React.FC<AcquisitionsHistogramProps> = ({
  data,
}) => {
  const histogram = useMemo(() => buildHistogram(data), [data]);

  if (data.length === 0) {
    return (
      <div
        role="status"
        className="flex h-48 sm:h-64 flex-col items-center justify-center gap-2 text-muted-foreground"
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
        <p className="font-medium">No histogram data</p>
        <p className="text-sm">Adjust filters to see distribution.</p>
      </div>
    );
  }

  return (
    <div
      className="h-48 sm:h-64 w-full"
      data-testid="acquisitions-histogram"
      role="img"
      aria-label={`Bar chart showing distribution of detected site counts across ${histogram.length} ranges.`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={histogram}
          margin={{ top: 5, right: 20, left: 0, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />

          <XAxis
            dataKey="range"
            tick={{ fontSize: 11, fill: CHART_COLORS.text }}
            stroke={CHART_COLORS.grid}
            label={{
              value: "Sites Count Range",
              position: "insideBottom",
              offset: -30,
              fill: CHART_COLORS.text,
              fontSize: 12,
            }}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: CHART_COLORS.text }}
            stroke={CHART_COLORS.grid}
            label={{
              value: "Number of Days",
              angle: -90,
              position: "insideLeft",
              fill: CHART_COLORS.text,
              fontSize: 12,
            }}
          />

          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value) => [Number(value), "days"]}
            labelFormatter={(label) => `Detected sites: ${label}`}
          />

          <Bar
            dataKey="count"
            name="Acquisitions"
            fill={CHART_COLORS.bar}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AcquisitionsHistogram;
