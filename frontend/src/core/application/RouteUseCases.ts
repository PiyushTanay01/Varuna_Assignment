import { IRouteApi } from '../ports/IRouteApi';
import { Route } from '../domain/route';
import type { ComparisonData } from '../domain/RouteComparison';
// ... rest of the file
export class GetComparisonUseCase {
  private routeApi: IRouteApi;

  constructor(routeApi: IRouteApi) {
    this.routeApi = routeApi;
  }

  async execute(): Promise<ComparisonData> {
    return this.routeApi.getComparison();
  }
}
export class GetRoutesUseCase {
  constructor(private routeApi: IRouteApi) {}

  async execute(): Promise<Route[]> {
    return this.routeApi.getAllRoutes();
  }
}

export class SetBaselineUseCase {
  constructor(private routeApi: IRouteApi) {}

  async execute(routeId: string): Promise<Route> {
    return this.routeApi.setBaseline(routeId);
  }
}