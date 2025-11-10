import type { IComplianceApi } from '../ports/IComplianceApi';
import type { BankingStatus, BankEntry, ComplianceRecord } from '../domain/Banking';
// No more @prisma/client import

export class GetBankingStatusUseCase {
  private api: IComplianceApi;
  constructor(api: IComplianceApi) { this.api = api; }
  execute(shipId: string, year: number): Promise<BankingStatus> {
    return this.api.getAdjustedCB(shipId, year);
  }
}

export class CalculateCBUseCase {
  private api: IComplianceApi;
  constructor(api: IComplianceApi) { this.api = api; }
  execute(shipId: string, year: number): Promise<ComplianceRecord> { // <-- FIXED
    return this.api.calculateCB(shipId, year);
  }
}

export class BankSurplusUseCase {
  private api: IComplianceApi;
  constructor(api: IComplianceApi) { this.api = api; }
  execute(shipId: string, year: number): Promise<BankEntry> {
    return this.api.bankSurplus(shipId, year);
  }
}

export class ApplySurplusUseCase {
  private api: IComplianceApi;
  constructor(api: IComplianceApi) { this.api = api; }
  execute(shipId: string, year: number, amount: number): Promise<BankEntry> {
    return this.api.applySurplus(shipId, year, amount);
  }
}