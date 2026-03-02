import type { AcquisitionDataPoint } from "@/entities/acquisition";

import type { AcquisitionFilters } from "./useAcquisitionFilters";

export function filterAcquisitions(
  data: AcquisitionDataPoint[],
  filters: AcquisitionFilters,
): AcquisitionDataPoint[] {
  return data.filter((row) => {
    if (filters.startDate && row.date < filters.startDate) return false;
    if (filters.endDate && row.date > filters.endDate) return false;
    if (filters.minSites && row.sites < Number(filters.minSites)) return false;
    if (filters.maxSites && row.sites > Number(filters.maxSites)) return false;
    return true;
  });
}
