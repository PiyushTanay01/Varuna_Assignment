export interface Route {
  id: string;
  route_id: string;
  year: number;
  ghg_intensity: number;
  is_baseline: boolean;
  vesselType: string;
  fuelType: string;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  createdAt: string;
  updatedAt: string;
}