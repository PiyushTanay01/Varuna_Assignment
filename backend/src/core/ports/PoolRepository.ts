import { Pool } from '@prisma/client';
import { PoolMemberResult } from '../domain/Pooling';

export interface IPoolRepository {
  createPool(year: number, members: PoolMemberResult[]): Promise<Pool>;
}