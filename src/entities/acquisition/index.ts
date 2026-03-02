export type Acquisition = {
  timestamp: number; // Unix timestamp
  ore_sites: number; // Number of detected ore sites (backend field name)
};

export type AcquisitionDataPoint = {
  date: string; // "YYYY-MM-DD"
  datetime: string; // "YYYY-MM-DD HH:mm:ss" — exact acquisition time
  sites: number;
  timestamp: number;
};

/** One row per calendar day — used by chart & histogram. */
export type DailyAggregation = {
  date: string; // "YYYY-MM-DD"
  sites: number;
};
