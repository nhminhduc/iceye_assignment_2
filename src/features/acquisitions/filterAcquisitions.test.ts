import { describe, expect, it } from "vitest";

import type { AcquisitionDataPoint } from "@/entities/acquisition";

import { filterAcquisitions } from "./filterAcquisitions";

const data: AcquisitionDataPoint[] = [
  { date: "2025-01-10", sites: 10, timestamp: 1736467200 },
  { date: "2025-01-15", sites: 30, timestamp: 1736899200 },
  { date: "2025-01-20", sites: 50, timestamp: 1737331200 },
  { date: "2025-01-25", sites: 70, timestamp: 1737763200 },
];

const empty = { startDate: "", endDate: "", minSites: "", maxSites: "" };

describe("filterAcquisitions", () => {
  it("returns all data when no filters set", () => {
    expect(filterAcquisitions(data, empty)).toHaveLength(4);
  });

  it("filters by startDate", () => {
    const result = filterAcquisitions(data, { ...empty, startDate: "2025-01-15" });
    expect(result).toHaveLength(3);
    expect(result[0].date).toBe("2025-01-15");
  });

  it("filters by endDate", () => {
    const result = filterAcquisitions(data, { ...empty, endDate: "2025-01-15" });
    expect(result).toHaveLength(2);
    expect(result[1].date).toBe("2025-01-15");
  });

  it("filters by date range", () => {
    const result = filterAcquisitions(data, {
      ...empty,
      startDate: "2025-01-15",
      endDate: "2025-01-20",
    });
    expect(result).toHaveLength(2);
  });

  it("filters by minSites", () => {
    const result = filterAcquisitions(data, { ...empty, minSites: "30" });
    expect(result).toHaveLength(3);
    expect(result.every((r) => r.sites >= 30)).toBe(true);
  });

  it("filters by maxSites", () => {
    const result = filterAcquisitions(data, { ...empty, maxSites: "50" });
    expect(result).toHaveLength(3);
    expect(result.every((r) => r.sites <= 50)).toBe(true);
  });

  it("filters by sites range", () => {
    const result = filterAcquisitions(data, { ...empty, minSites: "20", maxSites: "60" });
    expect(result).toHaveLength(2);
    expect(result[0].sites).toBe(30);
    expect(result[1].sites).toBe(50);
  });

  it("combines date and sites filters", () => {
    const result = filterAcquisitions(data, {
      startDate: "2025-01-15",
      endDate: "2025-01-25",
      minSites: "40",
      maxSites: "",
    });
    expect(result).toHaveLength(2);
    expect(result[0].date).toBe("2025-01-20");
    expect(result[1].date).toBe("2025-01-25");
  });

  it("returns empty array when nothing matches", () => {
    const result = filterAcquisitions(data, { ...empty, minSites: "100" });
    expect(result).toHaveLength(0);
  });
});
