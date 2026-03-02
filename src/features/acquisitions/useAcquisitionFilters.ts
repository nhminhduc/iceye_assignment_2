import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

export interface AcquisitionFilters {
  startDate: string; // "YYYY-MM-DD" or ""
  endDate: string;
  minSites: string; // numeric string or ""
  maxSites: string;
}

const PARAM_KEYS = {
  startDate: "from",
  endDate: "to",
  minSites: "minSites",
  maxSites: "maxSites",
} as const;

export function useAcquisitionFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: AcquisitionFilters = useMemo(
    () => ({
      startDate: searchParams.get(PARAM_KEYS.startDate) ?? "",
      endDate: searchParams.get(PARAM_KEYS.endDate) ?? "",
      minSites: searchParams.get(PARAM_KEYS.minSites) ?? "",
      maxSites: searchParams.get(PARAM_KEYS.maxSites) ?? "",
    }),
    [searchParams],
  );

  const setFilters = useCallback(
    (updates: Partial<AcquisitionFilters>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, paramName] of Object.entries(PARAM_KEYS)) {
          const value = updates[key as keyof AcquisitionFilters];
          if (value !== undefined) {
            if (value === "") {
              next.delete(paramName);
            } else {
              next.set(paramName, value);
            }
          }
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return { filters, setFilters, clearFilters };
}
