import { useMemo } from "react";

import { AcquisitionFilters } from "@/features/acquisitions/AcquisitionFilters";
import { AcquisitionsTable } from "@/features/acquisitions/AcquisitionsTable";
import { filterAcquisitions } from "@/features/acquisitions/filterAcquisitions";
import { useAcquisitionFilters } from "@/features/acquisitions/useAcquisitionFilters";
import { useAcquisitions } from "@/features/acquisitions/useAcquisitions";

export function DashboardPage() {
  const { data, isLoading, isError, error } = useAcquisitions();
  const { filters } = useAcquisitionFilters();

  const filtered = useMemo(
    () => (data ? filterAcquisitions(data, filters) : []),
    [data, filters],
  );

  if (isLoading) return <p>Loading acquisitions...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <>
      <h1>Acquisitions</h1>
      <AcquisitionFilters />
      <AcquisitionsTable data={filtered} />
    </>
  );
}
