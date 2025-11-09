import { IRouteRepository } from '../ports/RouteRepository';
import { IComplianceRepository } from '../ports/ComplianceRepository';
import { calculateComplianceBalance } from '../domain/Compliance';


export class ComputeComplianceBalanceUseCase {
  constructor(
    private routeRepository: IRouteRepository,
    private complianceRepository: IComplianceRepository
  ) {}

  async execute(ship_id: string, year: number) {
    const route = await this.routeRepository.getRouteByRouteId(ship_id);
    if (!route) {
      throw new Error(`Route (Ship ID) ${ship_id} not found.`);
    }

    if (route.year !== year) {
      throw new Error(`Data for ship ${ship_id} is for year ${route.year}, not ${year}.`);
    }

    const cb = calculateComplianceBalance(
      route.ghg_intensity,
      route.fuelConsumption
    );

    const complianceRecord = await this.complianceRepository.upsertShipCompliance(
      ship_id,
      year,
      cb
    );
    
    return complianceRecord;
  }
}

export class GetBankingRecordsUseCase {
  constructor(private complianceRepository: IComplianceRepository) {}

  async execute(ship_id: string, year: number) {
    return this.complianceRepository.getBankEntries(ship_id, year);
  }
}

export class BankSurplusUseCase {
  constructor(private complianceRepository: IComplianceRepository) {}

  async execute(ship_id: string, year: number) {
    const complianceRecord = await this.complianceRepository.getShipCompliance(
      ship_id,
      year
    );

    if (!complianceRecord) {
      throw new Error(`No compliance record found for ${ship_id} in ${year}. Run calculation first.`);
    }

    if (complianceRecord.cb_gco2eq <= 0) {
      throw new Error('No surplus to bank. Compliance Balance is zero or negative.');
    }

    return this.complianceRepository.createBankEntry(
      ship_id,
      year,
      complianceRecord.cb_gco2eq
    );
  }
}

export class ApplyBankedSurplusUseCase {
  constructor(private complianceRepository: IComplianceRepository) {}

  async execute(ship_id: string, year: number, amountToApply: number) {
    if (amountToApply <= 0) {
      throw new Error('Amount to apply must be positive.');
    }
    
    const complianceRecord = await this.complianceRepository.getShipCompliance(
      ship_id,
      year
    );

    if (!complianceRecord) {
      throw new Error(`No compliance record found for ${ship_id} in ${year}. Run calculation first.`);
    }

    if (complianceRecord.cb_gco2eq >= 0) {
      throw new Error('No deficit to apply surplus to. Ship is already in compliance or neutral.');
    }

    const totalAvailableSurplus = await this.complianceRepository.getTotalBankedSurplus(ship_id);

    if (amountToApply > totalAvailableSurplus) {
      throw new Error(`Insufficient banked surplus. Available: ${totalAvailableSurplus}, Tried to apply: ${amountToApply}`);
    }

    const deficit = Math.abs(complianceRecord.cb_gco2eq);
    const finalAmountToApply = Math.min(amountToApply, deficit);

    return this.complianceRepository.createBankEntry(
      ship_id,
      year,
      -finalAmountToApply 
    );
  }
}

export class GetAdjustedComplianceBalanceUseCase {
  constructor(private complianceRepository: IComplianceRepository) {}

  async execute(ship_id: string, year: number) {
    
    const complianceRecord = await this.complianceRepository.getShipCompliance(
      ship_id,
      year
    );
    const rawCB = complianceRecord?.cb_gco2eq || 0;

    const bankEntries = await this.complianceRepository.getBankEntries(
      ship_id,
      year
    );
    
  
    const yearTransactionSum = bankEntries.reduce(
      (sum, entry) => sum + entry.amount_gco2eq,
      0
    );

    
    const totalBankedSurplus = await this.complianceRepository.getTotalBankedSurplus(ship_id);

    return {
        ship_id,
        year,
        cb_before: rawCB,
        applied_or_banked: yearTransactionSum,
        cb_after: rawCB - yearTransactionSum, 
        total_available_bank: totalBankedSurplus, 
    };
  }
}