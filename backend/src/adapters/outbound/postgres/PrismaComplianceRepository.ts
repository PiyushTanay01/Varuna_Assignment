import { IComplianceRepository } from '../../../core/ports/ComplianceRepository';
import { ShipCompliance, BankEntry } from '../../../core/domain/Compliance';
import { prisma } from '../../../infrastructure/db/PrismaClient';

export class PrismaComplianceRepository implements IComplianceRepository {
  
  async upsertShipCompliance(
    ship_id: string,
    year: number,
    cb_gco2eq: number
  ): Promise<ShipCompliance> {
    return prisma.shipCompliance.upsert({
      where: { ship_id_year: { ship_id, year } },
      update: { cb_gco2eq: cb_gco2eq },
      create: { ship_id, year, cb_gco2eq: cb_gco2eq },
    });
  }

  async getShipCompliance(
    ship_id: string,
    year: number
  ): Promise<ShipCompliance | null> {
    return prisma.shipCompliance.findUnique({
      where: { ship_id_year: { ship_id, year } },
    });
  }

  async getTotalBankedSurplus(ship_id: string): Promise<number> {
    const result = await prisma.bankEntry.aggregate({
      where: { ship_id: ship_id },
      _sum: {
        amount_gco2eq: true,
      },
    });
    return result._sum.amount_gco2eq || 0;
  }

  async createBankEntry(
    ship_id: string,
    year: number,
    amount_gco2eq: number
  ): Promise<BankEntry> {
    return prisma.bankEntry.create({
      data: {
        ship_id: ship_id,
        year: year,
        amount_gco2eq: amount_gco2eq,
      },
    });
  }

  async getBankEntries(ship_id: string, year: number): Promise<BankEntry[]> {
    return prisma.bankEntry.findMany({
      where: { ship_id: ship_id, year: year },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}