import axios from 'axios';
import type { BankingStatus, BankEntry, ComplianceRecord } from '../../../core/domain/Banking';
import type { IComplianceApi } from '../../../core/ports/IComplianceApi';
// No more @prisma/client import

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export class ComplianceApi implements IComplianceApi {
  
  async getAdjustedCB(shipId: string, year: number): Promise<BankingStatus> {
    const response = await apiClient.get('/compliance/adjusted-cb', {
      params: { shipId, year },
    });
    return response.data;
  }

  async calculateCB(shipId: string, year: number): Promise<ComplianceRecord> { // <-- FIXED
    const response = await apiClient.get('/compliance/cb', {
      params: { shipId, year },
    });
    return response.data;
  }

  async bankSurplus(shipId: string, year: number): Promise<BankEntry> {
    const response = await apiClient.post('/banking/bank', { shipId, year });
    return response.data;
  }

  async applySurplus(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const response = await apiClient.post('/banking/apply', { shipId, year, amount });
    return response.data;
  }
}