import { IRouteRepository } from '../ports/RouteRepository';
import { Route } from '../domain/route';

export class RouteUseCases {
  constructor(private routeRepository: IRouteRepository) {}

  async getAllRoutes(): Promise<Route[]> {
    return this.routeRepository.getAllRoutes();
  }
}