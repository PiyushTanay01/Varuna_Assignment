import { Pool } from '@prisma/client';
import { IPoolRepository } from '../../../core/ports/PoolRepository';
import { PoolMemberResult } from '../../../core/domain/Pooling';
import { prisma } from '../../../infrastructure/db/PrismaClient';

export class PrismaPoolRepository implements IPoolRepository {
  
  async createPool(year: number, members: PoolMemberResult[]): Promise<Pool> {
    
    return prisma.$transaction(async (tx) => {
      
      const newPool = await tx.pool.create({
        data: {
          year: year,
        },
      });

      
      const memberData = members.map((m) => ({
        pool_id: newPool.id,
        ship_id: m.ship_id,
        cb_before: m.cb_before,
        cb_after: m.cb_after,
      }));

      await tx.poolMember.createMany({
        data: memberData,
      });

      return tx.pool.findUniqueOrThrow({
        where: { id: newPool.id },
        include: {
          members: true,
        },
      });
    });
  }
}