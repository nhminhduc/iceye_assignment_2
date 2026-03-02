import type { DailyAggregation } from "@/entities/acquisition";

export interface HistogramBin {
  range: string;
  count: number;
  min: number;
  max: number;
}

export function buildHistogram(
  data: DailyAggregation[],
  bins = 8,
): HistogramBin[] {
  if (data.length === 0) return [];

  const values = data.map((d) => d.sites);
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return [{ range: String(min), count: data.length, min, max }];
  }

  const binSize = Math.ceil((max - min + 1) / bins);
  const histogram: HistogramBin[] = Array.from({ length: bins }, (_, i) => {
    const lo = min + i * binSize;
    const hi = lo + binSize - 1;
    return { range: `${lo}–${hi}`, count: 0, min: lo, max: hi };
  });

  for (const v of values) {
    const idx = Math.min(Math.floor((v - min) / binSize), bins - 1);
    histogram[idx].count++;
  }

  return histogram.filter((b) => b.count > 0);
}
