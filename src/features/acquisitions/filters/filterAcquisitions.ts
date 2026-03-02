import type { AcquisitionDataPoint } from "@/entities/acquisition";

import type { AcquisitionFilters } from "./useAcquisitionFilters";

export function filterAcquisitions(
  data: AcquisitionDataPoint[],
  filters: AcquisitionFilters,
): AcquisitionDataPoint[] {
  const minSites =
    filters.minSites !== "" ? Number(filters.minSites) : undefined;
  const maxSites =
    filters.maxSites !== "" ? Number(filters.maxSites) : undefined;

  return data.filter((row) => {
    if (filters.startDate && row.date < filters.startDate) return false;
    if (filters.endDate && row.date > filters.endDate) return false;
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
