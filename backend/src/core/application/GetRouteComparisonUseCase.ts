import { IRouteRepository } from '../ports/RouteRepository';
import { RouteComparison } from '../domain/RouteComparison';

const TARGET_INTENSITY = 89.3368; 

export class GetRouteComparisonUseCase {
  constructor(private routeRepository: IRouteRepository) {}

  async execute(year: number): Promise<{
    baseline: any;
    comparisons: RouteComparison[];
  }> {
    const baseline = await this.routeRepository.getBaselineRoute();
    if (!baseline) {
      throw new Error('No baseline route set.');
    }

    const comparisonRoutes = await this.routeRepository.getComparisonRoutes(year);

    const comparisons: RouteComparison[] = comparisonRoutes.map((route) => {
      const percentDiff =
        ((route.ghg_intensity / baseline.ghg_intensity) - 1) * 100;

      const compliant = route.ghg_intensity <= TARGET_INTENSITY;

      return {
        ...route,
        percentDiff: percentDiff,
        compliant: compliant,
      };
    });

    return {
      baseline: {
        route_id: baseline.route_id,
        ghg_intensity: baseline.ghg_intensity,
        target_intensity: TARGET_INTENSITY,
      },
      comparisons: comparisons,
    };
  }
}