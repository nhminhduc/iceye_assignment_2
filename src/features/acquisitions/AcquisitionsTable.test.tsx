import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { AcquisitionDataPoint } from "@/entities/acquisition";

import { AcquisitionsTable } from "./AcquisitionsTable";

const mockData: AcquisitionDataPoint[] = [
  { date: "2025-01-15", sites: 42, timestamp: 1736899200 },
  { date: "2025-01-16", sites: 37, timestamp: 1736985600 },
  { date: "2025-01-17", sites: 55, timestamp: 1737072000 },
];

describe("AcquisitionsTable", () => {
  it("shows empty message when no data", () => {
    render(<AcquisitionsTable data={[]} />);
    expect(screen.getByText(/no acquisition data/i)).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<AcquisitionsTable data={mockData} />);
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Sites")).toBeInTheDocument();
  });

  it("renders all rows", () => {
    render(<AcquisitionsTable data={mockData} />);
    expect(screen.getByText("2025-01-15")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("2025-01-16")).toBeInTheDocument();
    expect(screen.getByText("37")).toBeInTheDocument();
    expect(screen.getByText("2025-01-17")).toBeInTheDocument();
    expect(screen.getByText("55")).toBeInTheDocument();
  });
});
