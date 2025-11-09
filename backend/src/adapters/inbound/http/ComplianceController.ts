import { Router, Request, Response } from 'express';
import { PrismaRouteRepository } from '../../outbound/postgres/PrismaRouteRepository';
import { PrismaComplianceRepository } from '../../outbound/postgres/PrismaComplianceRepository';
import {
  GetAdjustedComplianceBalanceUseCase, 
} from '../../../core/application/ComplianceUseCases';
import {
  ComputeComplianceBalanceUseCase,
  GetBankingRecordsUseCase,
  BankSurplusUseCase,
  ApplyBankedSurplusUseCase,
} from '../../../core/application/ComplianceUseCases';

const router = Router();


const routeRepository = new PrismaRouteRepository();
const complianceRepository = new PrismaComplianceRepository();

const getAdjustedComplianceBalanceUseCase = new GetAdjustedComplianceBalanceUseCase(
  complianceRepository
);
const computeComplianceBalanceUseCase = new ComputeComplianceBalanceUseCase(
  routeRepository,
  complianceRepository
);
const getBankingRecordsUseCase = new GetBankingRecordsUseCase(complianceRepository);
const bankSurplusUseCase = new BankSurplusUseCase(complianceRepository);
const applyBankedSurplusUseCase = new ApplyBankedSurplusUseCase(complianceRepository);


router.get('/compliance/cb', async (req: Request, res: Response) => {
  try {
    const { shipId, year } = req.query;
    if (!shipId || !year) {
      return res.status(400).json({ error: 'shipId and year query parameters are required.' });
    }
    
    const record = await computeComplianceBalanceUseCase.execute(
      shipId as string,
      parseInt(year as string)
    );
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


router.get('/banking/records', async (req: Request, res: Response) => {
  try {
    const { shipId, year } = req.query;
    if (!shipId || !year) {
      return res.status(400).json({ error: 'shipId and year query parameters are required.' });
    }

    const records = await getBankingRecordsUseCase.execute(
      shipId as string,
      parseInt(year as string)
    );
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


router.post('/banking/bank', async (req: Request, res: Response) => {
  try {
    const { shipId, year } = req.body;
    if (!shipId || !year) {
      return res.status(400).json({ error: 'shipId and year properties are required.' });
    }

    const entry = await bankSurplusUseCase.execute(shipId, year);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message }); 
  }
});


router.post('/banking/apply', async (req: Request, res: Response) => {
  try {
    const { shipId, year, amount } = req.body;
    if (!shipId || !year || !amount) {
      return res.status(400).json({ error: 'shipId, year, and amount properties are required.' });
    }

    const entry = await applyBankedSurplusUseCase.execute(shipId, year, amount);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/compliance/adjusted-cb', async (req: Request, res: Response) => {
  try {
    const { shipId, year } = req.query;
    if (!shipId || !year) {
      return res.status(400).json({ error: 'shipId and year query parameters are required.' });
    }

    const result = await getAdjustedComplianceBalanceUseCase.execute(
      shipId as string,
      parseInt(year as string)
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;