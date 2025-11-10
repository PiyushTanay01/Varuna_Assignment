import axios from 'axios';
import type { Pool } from '../../../core/domain/Pooling';
import type { IPoolApi } from '../../../core/ports/IPoolApi';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export class PoolApi implements IPoolApi {
  async createPool(shipIds: string[], year: number): Promise<Pool> {
    const response = await apiClient.post('/pools', { shipIds, year });
    return response.data;
  }
}