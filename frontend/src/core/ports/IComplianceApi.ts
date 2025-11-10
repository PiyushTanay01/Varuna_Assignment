import type { BankingStatus, BankEntry, ComplianceRecord } from '../domain/Banking';
// No more @prisma/client import

export interface IComplianceApi {
  // Fetches the full banking status for a ship
  getAdjustedCB(shipId: string, year: number): Promise<BankingStatus>;
  
  // Triggers the "raw" CB calculation
  calculateCB(shipId: string, year: number): Promise<ComplianceRecord>; // <-- FIXED
  
  // Banks a surplus
  bankSurplus(shipId: string, year: number): Promise<BankEntry>;
  
  // Applies a banked surplus to a deficit
  applySurplus(shipId: string, year: number, amount: number): Promise<BankEntry>;
}