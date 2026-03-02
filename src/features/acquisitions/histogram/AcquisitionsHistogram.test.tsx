import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { DailyAggregation } from "@/entities/acquisition";

import AcquisitionsHistogram from "./AcquisitionsHistogram";
import { buildHistogram } from "./buildHistogram";

const mockData: DailyAggregation[] = [
  { date: "2025-01-15", sites: 10 },
  { date: "2025-01-16", sites: 20 },
  { date: "2025-01-17", sites: 30 },
  { date: "2025-01-18", sites: 10 },
  { date: "2025-01-19", sites: 20 },
];

describe("buildHistogram", () => {
  it("returns empty array for no data", () => {
    expect(buildHistogram([])).toEqual([]);
  });

  it("returns single bin when all values equal", () => {
    const data: DailyAggregation[] = [
      { date: "2025-01-15", sites: 5 },
      { date: "2025-01-16", sites: 5 },
    ];
    const bins = buildHistogram(data);
    expect(bins).toHaveLength(1);
    expect(bins[0].count).toBe(2);
  });

  it("distributes values into bins", () => {
    const bins = buildHistogram(mockData, 4);
    const totalCount = bins.reduce((sum, b) => sum + b.count, 0);
    expect(totalCount).toBe(mockData.length);
  });
});

describe("AcquisitionsHistogram", () => {
  it("shows empty message when no data", () => {
    render(<AcquisitionsHistogram data={[]} />);
    expect(screen.getByText(/no histogram data/i)).toBeInTheDocument();
  });

  it("renders histogram container with data", () => {
    render(<AcquisitionsHistogram data={mockData} />);
    expect(screen.getByTestId("acquisitions-histogram")).toBeInTheDocument();
  });
});
