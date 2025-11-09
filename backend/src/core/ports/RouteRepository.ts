import { Route } from '../domain/route';

export interface IRouteRepository {
  getAllRoutes(): Promise<Route[]>;
  getRouteById(id: string): Promise<Route | null>;
  setAsBaseline(routeId: string): Promise<Route>;

  getBaselineRoute(): Promise<Route | null>;
  getComparisonRoutes(year: number): Promise<Route[]>;
}