import { Router, Request, Response } from 'express';
import { RouteUseCases } from '../../../core/application/RouteUseCases.ts';
import { PrismaRouteRepository } from '../../outbound/postgres/PrismaRouteRepository';
import { GetRouteComparisonUseCase } from '../../../core/application/GetRouteComparisonUseCase';
const router = Router();

const routeRepository = new PrismaRouteRepository();
const routeUseCases = new RouteUseCases(routeRepository);
const getRouteComparisonUseCase = new GetRouteComparisonUseCase(routeRepository);
// GET /routes
router.get('/routes', async (req: Request, res: Response) => {
  try {
    const routes = await routeUseCases.getAllRoutes();
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

router.post('/routes/:id/baseline', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const route = await routeRepository.setAsBaseline(id);
    res.status(200).json(route);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to set baseline' });
  }
});

router.get('/routes/comparison', async (req: Request, res: Response) => {
  try {
    const year = 2025; 
    const data = await getRouteComparisonUseCase.execute(year);
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'No baseline route set.') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch route comparison' });
  }
});

export default router;