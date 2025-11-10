export interface Baseline {
  route_id: string;
  ghg_intensity: number;
  target_intensity: number;
}

export interface Comparison {
  id: string;
  route_id: string;
  year: number;
  ghg_intensity: number;
  vesselType: string;
  fuelType: string;
  percentDiff: number;
  compliant: boolean;
}

export interface ComparisonData {
  baseline: Baseline;
  comparisons: Comparison[];
}