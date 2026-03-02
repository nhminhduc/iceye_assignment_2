import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  type AcquisitionFilters as Filters,
  useAcquisitionFilters,
} from "./useAcquisitionFilters";

interface AcquisitionFiltersProps {
  minDate?: string;
  maxDate?: string;
  minSitesValue?: number;
  maxSitesValue?: number;
}

export function AcquisitionFilters({
  minDate,
  maxDate,
  minSitesValue,
  maxSitesValue,
}: AcquisitionFiltersProps) {
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
      <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-end sm:gap-5">
        <label className="space-y-1.5 text-sm font-medium">
          <span className="pr-1 text-muted-foreground">From</span>
          <Input
            type="date"
            value={filters.startDate}
            onChange={update("startDate")}
            min={minDate}
            max={maxDate}
            aria-label="Start date"
            className="w-full sm:w-40"
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          <span className="pr-1 text-muted-foreground">To</span>
          <Input
            type="date"
            value={filters.endDate}
            onChange={update("endDate")}
            min={minDate}
            max={maxDate}
            aria-label="End date"
            className="w-full sm:w-40"
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          <span className="pr-1 text-muted-foreground">Min sites</span>
          <Input
            type="number"
            min={minSitesValue ?? 0}
            max={
              filters.maxSites !== "" ? Number(filters.maxSites) : maxSitesValue
            }
            step={1}
            value={filters.minSites}
            onChange={update("minSites")}
            placeholder={String(minSitesValue ?? 0)}
            aria-label="Minimum detected sites"
            className="w-full sm:w-24"
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          <span className="pr-1 text-muted-foreground">Max sites</span>
          <Input
            type="number"
            min={
              filters.minSites !== ""
                ? Number(filters.minSites)
                : (minSitesValue ?? 0)
            }
            max={maxSitesValue}
            step={1}
            value={filters.maxSites}
            onChange={update("maxSites")}
            placeholder={
              maxSitesValue !== undefined ? String(maxSitesValue) : "∞"
            }
            aria-label="Maximum detected sites"
            className="w-full sm:w-24"
          />
        </label>
        <Button
          variant="outline"
          size="sm"
          className="col-span-2 transition-colors hover:bg-destructive/10 hover:text-destructive sm:col-span-1"
          onClick={clearFilters}
          disabled={!hasActive}
          aria-label="Clear all filters"
        >
          Clear
        </Button>
      </div>
    </fieldset>
  );
}
