import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { AcquisitionDataPoint } from "@/entities/acquisition";

import { AcquisitionsTable } from "./AcquisitionsTable";

const mockData: AcquisitionDataPoint[] = [
  {
    date: "2025-01-15",
    datetime: "2025-01-15 08:30:12",
    sites: 42,
    timestamp: 1736899200,
  },
  {
    date: "2025-01-16",
    datetime: "2025-01-16 14:22:05",
    sites: 37,
    timestamp: 1736985600,
  },
  {
    date: "2025-01-17",
    datetime: "2025-01-17 21:15:48",
    sites: 55,
    timestamp: 1737072000,
  },
];

describe("AcquisitionsTable", () => {
  it("shows empty message when no data", () => {
    render(<AcquisitionsTable data={[]} />);
    expect(screen.getByText(/no data for selected range/i)).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<AcquisitionsTable data={mockData} />);
    expect(screen.getByText("Date & Time")).toBeInTheDocument();
    expect(screen.getByText("Detected Sites")).toBeInTheDocument();
  });

  it("renders record count", () => {
    render(<AcquisitionsTable data={mockData} />);
    expect(screen.getByText(/3 records/)).toBeInTheDocument();
  });

  it("renders the scroll viewport", () => {
    render(<AcquisitionsTable data={mockData} />);
    expect(screen.getByTestId("acquisitions-table-scroll")).toBeInTheDocument();
  });
});
