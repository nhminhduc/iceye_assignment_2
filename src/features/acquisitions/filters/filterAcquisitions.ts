import type {
  AcquisitionDataPoint,
  DailyAggregation,
} from "@/entities/acquisition";

import type { AcquisitionFilters } from "./useAcquisitionFilters";

/** Filter raw records by date range only. */
export function filterAcquisitions(
  data: AcquisitionDataPoint[],
  filters: AcquisitionFilters,
): AcquisitionDataPoint[] {
  return data.filter((row) => {
    if (filters.startDate && row.date < filters.startDate) return false;
    if (filters.endDate && row.date > filters.endDate) return false;
    return true;
  });
}

/** Filter daily-aggregated data by sites range. */
export function filterDaily(
  data: DailyAggregation[],
  filters: AcquisitionFilters,
): DailyAggregation[] {
  const minSites =
    filters.minSites !== "" ? Number(filters.minSites) : undefined;
  const maxSites =
    filters.maxSites !== "" ? Number(filters.maxSites) : undefined;

  return data.filter((row) => {
    if (
      minSites !== undefined &&
      !Number.isNaN(minSites) &&
      row.sites < minSites
    )
      return false;
    if (
      maxSites !== undefined &&
      !Number.isNaN(maxSites) &&
      row.sites > maxSites
    )
      return false;
    return true;
  });
}
