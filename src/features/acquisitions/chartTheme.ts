import type { CSSProperties } from "react";

/**
 * Shared recharts tooltip style that follows the app's light / dark theme.
 * Uses CSS custom properties so it updates automatically on theme switch.
 *
 * NOTE: CSS vars contain complete oklch() values, so we use var() directly
 * (not wrapped in hsl()).
 */
export const TOOLTIP_STYLE: CSSProperties = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  color: "var(--popover-foreground)",
};

/**
 * Theme-aware colour tokens for recharts elements.
 * --chart-1…5 are defined in index.css with separate light/dark values.
 */
export const CHART_COLORS = {
  line: "var(--chart-1)",
  bar: "var(--chart-2)",
  grid: "var(--border)",
  text: "var(--muted-foreground)",
} as const;
