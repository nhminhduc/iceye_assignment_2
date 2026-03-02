import type { AcquisitionDataPoint } from "@/entities/acquisition";

interface AcquisitionsTableProps {
  data: AcquisitionDataPoint[];
}

export function AcquisitionsTable({ data }: AcquisitionsTableProps) {
  if (data.length === 0) {
    return <p>No acquisition data.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: 8 }}>Date</th>
          <th style={{ textAlign: "right", padding: 8 }}>Sites</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.timestamp}>
            <td style={{ padding: 8 }}>{row.date}</td>
            <td style={{ padding: 8, textAlign: "right" }}>{row.sites}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
