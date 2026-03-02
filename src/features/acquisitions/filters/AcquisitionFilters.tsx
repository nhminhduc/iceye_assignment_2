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
    <fieldset className="border-0 p-0 m-0">
      <legend className="sr-only">Filter acquisitions</legend>
      <div className="flex flex-wrap items-end gap-3">
        <label className="space-y-1 text-sm font-medium">
          <span>From</span>
          <Input
            type="date"
            value={filters.startDate}
            onChange={update("startDate")}
            aria-label="Start date"
            className="w-full min-w-35 sm:w-40"
          />
        </label>
        <label className="space-y-1 text-sm font-medium">
          <span>To</span>
          <Input
            type="date"
            value={filters.endDate}
            onChange={update("endDate")}
            aria-label="End date"
            className="w-full min-w-35 sm:w-40"
          />
        </label>
        <label className="space-y-1 text-sm font-medium">
          <span>Min sites</span>
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
        <label className="space-y-1 text-sm font-medium">
          <span>Max sites</span>
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
        >
          Clear
        </Button>
      </div>
    </fieldset>
  );
}
