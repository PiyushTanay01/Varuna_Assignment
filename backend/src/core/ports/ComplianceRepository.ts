import { ShipCompliance, BankEntry } from '../domain/Compliance';

export interface IComplianceRepository {

  upsertShipCompliance(
    ship_id: string,
    year: number,
    cb_gco2eq: number
  ): Promise<ShipCompliance>;


  getShipCompliance(
    ship_id: string,
    year: number
  ): Promise<ShipCompliance | null>;


  getTotalBankedSurplus(ship_id: string): Promise<number>;


  createBankEntry(
    ship_id: string,
    year: number,
    amount_gco2eq: number
  ): Promise<BankEntry>;


  getBankEntries(ship_id: string, year: number): Promise<BankEntry[]>;
}