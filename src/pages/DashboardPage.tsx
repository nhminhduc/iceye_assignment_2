import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  AcquisitionFilters,
  AcquisitionsChart,
  AcquisitionsHistogram,
  AcquisitionsTable,
  aggregateByDate,
  filterAcquisitions,
  filterDaily,
  useAcquisitionFilters,
  useAcquisitions,
} from "@/features/acquisitions";

import { DashboardSkeleton } from "./DashboardSkeleton";

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useAcquisitions();
  const { filters, setFilters } = useAcquisitionFilters();

  // Filter records by date, aggregate into daily, then filter daily by sites range
  const dateFilteredRecords = useMemo(
    () => (data ? filterAcquisitions(data.records, filters) : []),
    [data, filters],
  );

  const filteredDaily = useMemo(
    () => filterDaily(aggregateByDate(dateFilteredRecords), filters),
    [dateFilteredRecords, filters],
  );

  // Records matching the final daily filter (for the table)
  const filteredRecords = useMemo(() => {
    const dailyDates = new Set(filteredDaily.map((d) => d.date));
    return dateFilteredRecords.filter((r) => dailyDates.has(r.date));
  }, [dateFilteredRecords, filteredDaily]);

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

      <AcquisitionFilters
        minDate={data?.records[0]?.date}
        maxDate={data?.records[data.records.length - 1]?.date}
        minSitesValue={
          data ? Math.min(...data.daily.map((d) => d.sites)) : undefined
        }
        maxSitesValue={
          data ? Math.max(...data.daily.map((d) => d.sites)) : undefined
        }
      />

      {/* Summary cards */}
      <div
        className="grid gap-5 grid-cols-1 sm:grid-cols-3"
        role="region"
        aria-label="Summary statistics"
      >
        <div className="card-interactive relative overflow-hidden rounded-xl border bg-card p-6 text-center shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Days with data
          </p>
          <p className="mt-2 text-4xl font-extrabold tabular-nums text-primary">
            {filteredDaily.length.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/70">
            total matching days
          </p>
        </div>
        <div className="card-interactive relative overflow-hidden rounded-xl border bg-card p-6 text-center shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-chart-2" />
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Avg detected sites
          </p>
          <p className="mt-2 text-4xl font-extrabold tabular-nums text-primary">
            {avgSites.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/70">per day</p>
        </div>
        <div className="card-interactive relative overflow-hidden rounded-xl border bg-card p-6 text-center shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-chart-3" />
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Peak detected sites
          </p>
          <p className="mt-2 text-4xl font-extrabold tabular-nums text-primary">
            {maxSites.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/70">
            single day maximum
          </p>
        </div>
      </div>

      {/* Timeline chart */}
      <section
        className="rounded-xl border bg-card p-6 shadow-sm"
        aria-label="Timeline chart"
      >
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Detected Sites Over Time
        </h2>
        <p className="mb-5 text-xs text-muted-foreground/70">
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
        className="rounded-xl border bg-card p-6 shadow-sm"
        aria-label="Distribution histogram"
      >
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Sites Distribution
        </h2>
        <p className="mb-5 text-xs text-muted-foreground/70">
          How often each range of detected-site counts occurs across all
          acquisitions.
        </p>
        <AcquisitionsHistogram data={filteredDaily} />
      </section>

      {/* Data table */}
      <section
        className="rounded-xl border bg-card p-6 shadow-sm"
        aria-label="Acquisitions data table"
      >
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          All Acquisitions
        </h2>
        <p className="mb-5 text-xs text-muted-foreground/70">
          Every individual acquisition record. The list is virtualised — scroll
          to explore.
        </p>
        <AcquisitionsTable data={filteredRecords} />
      </section>
    </div>
  );
}
