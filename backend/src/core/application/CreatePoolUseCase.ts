import { IComplianceRepository } from '../ports/ComplianceRepository';
import { IPoolRepository } from '../ports/PoolRepository';
import { IRouteRepository } from '../ports/RouteRepository'; 
import { allocatePoolSurplus } from '../domain/Pooling';
import { calculateComplianceBalance } from '../domain/Compliance';

export class CreatePoolUseCase {
  constructor(
    private complianceRepository: IComplianceRepository,
    private poolRepository: IPoolRepository,
    private routeRepository: IRouteRepository 
  ) {}

  async execute(memberShipIds: string[], year: number) {
    
    const memberPromises = memberShipIds.map(async (shipId) => {
      
      let complianceRecord =
        await this.complianceRepository.getShipCompliance(shipId, year);
      
      let cb_before = 0;

      if (complianceRecord) {
        cb_before = complianceRecord.cb_gco2eq;
      } else {
        const route = await this.routeRepository.getRouteByRouteId(shipId);
        if (!route) {
          throw new Error(`Ship ${shipId} not found in Routes table.`);
        }
        if (route.year !== year) {
          throw new Error(`Route data for ${shipId} is for ${route.year}, not ${year}.`);
        }

        const calculatedCB = calculateComplianceBalance(
          route.ghg_intensity,
          route.fuelConsumption
        );

        const newRecord = await this.complianceRepository.upsertShipCompliance(
          shipId,
          year,
          calculatedCB
        );
        
        cb_before = newRecord.cb_gco2eq;
      }

      return {
        ship_id: shipId,
        cb_before: cb_before,
      };
    });

    const members = await Promise.all(memberPromises);

    const allocatedMembers = allocatePoolSurplus(members);

    const newPool = await this.poolRepository.createPool(
      year,
      allocatedMembers
    );

    return newPool;
  }
}