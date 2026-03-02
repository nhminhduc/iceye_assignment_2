import { Skeleton } from "@/components/ui/skeleton";

/** Full-page skeleton shown while acquisition data is loading. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      {/* Title */}
      <Skeleton className="h-8 w-48" />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-14 w-36" />
        ))}
        <Skeleton className="h-9 w-16 self-end" />
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-4 flex flex-col items-center gap-2"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <Skeleton className="h-5 w-52" />
        <Skeleton className="h-3 w-80" />
        <Skeleton className="h-80 w-full" />
      </div>

      {/* Histogram */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-72" />
        <Skeleton className="h-64 w-full" />
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-64" />
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-11 w-full" />
        ))}
      </div>
    </div>
  );
}
