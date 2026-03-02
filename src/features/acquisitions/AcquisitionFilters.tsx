import {
  type AcquisitionFilters as Filters,
  useAcquisitionFilters,
} from "./useAcquisitionFilters";

export function AcquisitionFilters() {
  const { filters, setFilters, clearFilters } = useAcquisitionFilters();

  const update = (key: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ [key]: e.target.value });
  };

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end", marginBottom: 16 }}>
      <label>
        From
        <input type="date" value={filters.startDate} onChange={update("startDate")} style={{ display: "block", padding: 4 }} />
      </label>
      <label>
        To
        <input type="date" value={filters.endDate} onChange={update("endDate")} style={{ display: "block", padding: 4 }} />
      </label>
      <label>
        Min sites
        <input type="number" min={0} value={filters.minSites} onChange={update("minSites")} placeholder="0" style={{ display: "block", padding: 4, width: 80 }} />
      </label>
      <label>
        Max sites
        <input type="number" min={0} value={filters.maxSites} onChange={update("maxSites")} placeholder="∞" style={{ display: "block", padding: 4, width: 80 }} />
      </label>
      <button onClick={clearFilters} style={{ padding: "4px 12px" }}>Clear</button>
    </div>
  );
}
