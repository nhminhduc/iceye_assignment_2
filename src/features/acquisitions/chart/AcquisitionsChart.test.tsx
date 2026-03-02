import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { DailyAggregation } from "@/entities/acquisition";

import AcquisitionsChart from "./AcquisitionsChart";

const mockData: DailyAggregation[] = [
  { date: "2025-01-15", sites: 42 },
  { date: "2025-01-16", sites: 37 },
  { date: "2025-01-17", sites: 55 },
];

describe("AcquisitionsChart", () => {
  it("shows empty message when no data", () => {
    render(<AcquisitionsChart data={[]} />);
    expect(screen.getByText(/no chart data available/i)).toBeInTheDocument();
  });

  it("renders chart container with data", () => {
    render(<AcquisitionsChart data={mockData} />);
    expect(screen.getByTestId("acquisitions-chart")).toBeInTheDocument();
  });
});
