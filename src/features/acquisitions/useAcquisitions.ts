import { useQuery } from "@tanstack/react-query";
import { format, fromUnixTime } from "date-fns";

import type {
  AcquisitionDataPoint,
  DailyAggregation,
} from "@/entities/acquisition";

import { acquisitionsApi } from "./acquisitionsApi";

/**
 * Merge multiple acquisitions on the same calendar day into one data-point
 * by summing detected sites. Result is sorted chronologically.
 */
export function aggregateByDate(
  data: AcquisitionDataPoint[],
): DailyAggregation[] {
  const map = new Map<string, number>();

  for (const d of data) {
    map.set(d.date, (map.get(d.date) ?? 0) + d.sites);
  }

  return Array.from(map, ([date, sites]) => ({ date, sites })).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

/**
 * Single source of truth for acquisition data.
 *
 * Returns **records** (one per raw acquisition, with exact datetime) and
 * **daily** (aggregated by calendar day) so every view — chart, histogram,
 * table — derives from the same query.
 */
export function useAcquisitions() {
  return useQuery({
    queryKey: ["acquisitions"],
    queryFn: acquisitionsApi.getAll,
    select: (
      raw,
    ): { records: AcquisitionDataPoint[]; daily: DailyAggregation[] } => {
      const records: AcquisitionDataPoint[] = raw
        .map((pt) => ({
          date: format(fromUnixTime(pt.timestamp), "yyyy-MM-dd"),
          datetime: format(fromUnixTime(pt.timestamp), "yyyy-MM-dd HH:mm:ss"),
          sites: pt.ore_sites,
          timestamp: pt.timestamp,
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

      const daily = aggregateByDate(records);

      return { records, daily };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
