import { Router, Request, Response } from 'express';
import { PrismaComplianceRepository } from '../../outbound/postgres/PrismaComplianceRepository';
import { PrismaPoolRepository } from '../../outbound/postgres/PrismaPoolRepository';
import { PrismaRouteRepository } from '../../outbound/postgres/PrismaRouteRepository'; 
import { CreatePoolUseCase } from '../../../core/application/CreatePoolUseCase';

const router = Router();

const complianceRepository = new PrismaComplianceRepository();
const poolRepository = new PrismaPoolRepository();
const routeRepository = new PrismaRouteRepository();

const createPoolUseCase = new CreatePoolUseCase(
  complianceRepository,
  poolRepository,
  routeRepository 
);

router.post('/pools', async (req: Request, res: Response) => {
  try {
    const { shipIds, year } = req.body;
    if (!shipIds || !Array.isArray(shipIds) || shipIds.length === 0 || !year) {
      return res.status(400).json({
        error:
          'shipIds (non-empty array) and year (number) are required.',
      });
    }

    const newPool = await createPoolUseCase.execute(shipIds, year);
    res.status(201).json(newPool);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;