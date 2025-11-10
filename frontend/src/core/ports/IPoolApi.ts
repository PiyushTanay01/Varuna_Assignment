import type { Pool } from '../domain/Pooling';

export interface IPoolApi {
  createPool(shipIds: string[], year: number): Promise<Pool>;
}