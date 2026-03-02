import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  AcquisitionFilters,
  AcquisitionsChart,
  AcquisitionsHistogram,
  AcquisitionsTable,
  aggregateByDate,
  filterAcquisitions,
  useAcquisitionFilters,
  useAcquisitions,
} from "@/features/acquisitions";

import { DashboardSkeleton } from "./DashboardSkeleton";

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useAcquisitions();
  const { filters, setFilters } = useAcquisitionFilters();

  // Filter raw records then derive daily aggregation — single source of truth
  const filteredRecords = useMemo(
    () => (data ? filterAcquisitions(data.records, filters) : []),
    [data, filters],
  );

  const filteredDaily = useMemo(
    () => aggregateByDate(filteredRecords),
    [filteredRecords],
  );

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-4 py-16 text-center"
      >
        <div className="rounded-full bg-destructive/10 p-3">
          <svg
            className="h-6 w-6 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <div>
          <p className="text-lg font-semibold">Failed to load acquisitions</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {error?.message ?? "An unknown error occurred."}
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const totalSites = filteredDaily.reduce((sum, d) => sum + d.sites, 0);
  const avgSites =
    filteredDaily.length > 0
      ? Math.round(totalSites / filteredDaily.length)
      : 0;
  const maxSites =
    filteredDaily.length > 0
      ? Math.max(...filteredDaily.map((d) => d.sites))
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Acquisitions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Satellite acquisition analytics and data exploration
        </p>
      </div>

      <AcquisitionFilters />

      {/* Summary cards */}
      <div
        className="grid gap-4 grid-cols-1 sm:grid-cols-3"
        role="region"
        aria-label="Summary statistics"
      >
        <div className="relative overflow-hidden rounded-lg border bg-card p-5 text-center shadow-sm transition-shadow hover:shadow-md">
          <div className="absolute inset-y-0 left-0 w-1 rounded-l-lg bg-primary" />
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Days with data
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-primary">
            {filteredDaily.length.toLocaleString()}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-card p-5 text-center shadow-sm transition-shadow hover:shadow-md">
          <div className="absolute inset-y-0 left-0 w-1 rounded-l-lg bg-chart-2" />
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Avg detected sites
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-primary">
            {avgSites.toLocaleString()}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-card p-5 text-center shadow-sm transition-shadow hover:shadow-md">
          <div className="absolute inset-y-0 left-0 w-1 rounded-l-lg bg-chart-3" />
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Peak detected sites
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-primary">
            {maxSites.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Timeline chart */}
      <section
        className="rounded-lg border bg-card p-6 shadow-sm"
        aria-label="Timeline chart"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          Detected Sites Over Time
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Each point shows the total ore sites detected on that date. Click and
          drag directly on the chart to zoom into a date range.
        </p>
        <AcquisitionsChart
          data={filteredDaily}
          onZoom={(startDate, endDate) => setFilters({ startDate, endDate })}
        />
      </section>

      {/* Histogram */}
      <section
        className="rounded-lg border bg-card p-6 shadow-sm"
        aria-label="Distribution histogram"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          Sites Distribution
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          How often each range of detected-site counts occurs across all
          acquisitions.
        </p>
        <AcquisitionsHistogram data={filteredDaily} />
      </section>

      {/* Data table */}
      <section
        className="rounded-lg border bg-card p-6 shadow-sm"
        aria-label="Acquisitions data table"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          All Acquisitions
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Every individual acquisition record. The list is virtualised — scroll
          to explore.
        </p>
        <AcquisitionsTable data={filteredRecords} />
      </section>
    </div>
  );
}
