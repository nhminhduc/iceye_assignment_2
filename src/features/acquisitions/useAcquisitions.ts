import { useQuery } from "@tanstack/react-query";
import { format, fromUnixTime } from "date-fns";

import type { AcquisitionDataPoint } from "@/entities/acquisition";

import { acquisitionsApi } from "./acquisitionsApi";

export function useAcquisitions() {
  return useQuery({
    queryKey: ["acquisitions"],
    queryFn: acquisitionsApi.getAll,
    select: (raw): AcquisitionDataPoint[] =>
      raw
        .map((pt) => ({
          date: format(fromUnixTime(pt.timestamp), "yyyy-MM-dd"),
          sites: pt.ore_sites,
          timestamp: pt.timestamp,
        }))
        .sort((a, b) => a.timestamp - b.timestamp),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
