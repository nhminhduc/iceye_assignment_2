import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  type AcquisitionFilters as Filters,
  useAcquisitionFilters,
} from "./useAcquisitionFilters";

export function AcquisitionFilters() {
  const { filters, setFilters, clearFilters } = useAcquisitionFilters();

  const update =
    (key: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ [key]: e.target.value });
    };

  const hasActive = Object.values(filters).some((v) => v !== "");

  return (
    <fieldset className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
      <legend className="px-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Filters
      </legend>
      <div className="flex flex-wrap items-end gap-5">
        <label className="space-y-1.5 space-x-1.5 text-sm font-medium">
          <span className="text-muted-foreground">From</span>
          <Input
            type="date"
            value={filters.startDate}
            onChange={update("startDate")}
            aria-label="Start date"
            className="w-full min-w-35 sm:w-40"
          />
        </label>
        <label className="space-y-1.5 space-x-1.5 text-sm font-medium">
          <span className="text-muted-foreground">To</span>
          <Input
            type="date"
            value={filters.endDate}
            onChange={update("endDate")}
            aria-label="End date"
            className="w-full min-w-35 sm:w-40"
          />
        </label>
        <label className="space-y-1.5 space-x-1.5 text-sm font-medium">
          <span className="text-muted-foreground">Min sites</span>
          <Input
            type="number"
            min={0}
            value={filters.minSites}
            onChange={update("minSites")}
            placeholder="0"
            aria-label="Minimum detected sites"
            className="w-full min-w-20 sm:w-24"
          />
        </label>
        <label className="space-y-1.5 space-x-1.5 text-sm font-medium">
          <span className="text-muted-foreground">Max sites</span>
          <Input
            type="number"
            min={0}
            value={filters.maxSites}
            onChange={update("maxSites")}
            placeholder="∞"
            aria-label="Maximum detected sites"
            className="w-full min-w-20 sm:w-24"
          />
        </label>
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          disabled={!hasActive}
          aria-label="Clear all filters"
          className="transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          Clear
        </Button>
      </div>
    </fieldset>
  );
}
