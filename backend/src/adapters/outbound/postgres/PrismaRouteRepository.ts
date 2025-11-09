import { IRouteRepository } from '../../../core/ports/RouteRepository';
import { Route } from '../../../core/domain/route';
import { prisma } from '../../../infrastructure/db/PrismaClient';

export class PrismaRouteRepository implements IRouteRepository {

  async getAllRoutes(): Promise<Route[]> {
    return prisma.route.findMany({
      orderBy: {
        route_id: 'asc',
      },
    });
  }

  async getRouteById(id: string): Promise<Route | null> {
    return prisma.route.findUnique({ where: { id } });
  }

  async setAsBaseline(routeId: string): Promise<Route> {
    
    return prisma.$transaction(async (tx) => {
      
      await tx.route.updateMany({
        where: { is_baseline: true },
        data: { is_baseline: false },
      });

      
      const newBaseline = await tx.route.update({
        where: { id: routeId },
        data: { is_baseline: true },
      });

      return newBaseline;
    });
  }
  async getBaselineRoute(): Promise<Route | null> {
    return prisma.route.findFirst({
      where: { is_baseline: true },
    });
  }

  async getComparisonRoutes(year: number): Promise<Route[]> {
    return prisma.route.findMany({
      where: {
        year: year,
        is_baseline: false,
      },
      orderBy: {
        route_id: 'asc',
      },
    });
  }
  async getRouteByRouteId(route_id: string): Promise<Route | null> {
    return prisma.route.findUnique({
      where: { route_id: route_id },
    });
  }
}