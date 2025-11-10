import type { Route } from '../domain/route';
import { ComparisonData } from '../domain/RouteComparison';
export interface IRouteApi {
  getAllRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<ComparisonData>;
}