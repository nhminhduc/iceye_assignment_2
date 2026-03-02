export interface Acquisition {
  timestamp: number; // Unix timestamp
  ore_sites: number; // Number of detected ore sites (backend field name)
}

export interface AcquisitionDataPoint {
  date: string; // "YYYY-MM-DD"
  sites: number;
  timestamp: number;
}
