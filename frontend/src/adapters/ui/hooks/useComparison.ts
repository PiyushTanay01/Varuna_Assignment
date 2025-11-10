import { useState, useEffect, useCallback } from 'react';
import { RouteApi } from '../../infrastructure/api/RouteApi';
import { GetComparisonUseCase } from '../../../core/application/RouteUseCases';
import type { ComparisonData } from '../../../core/domain/RouteComparison';

// Instantiate dependencies
const routeApi = new RouteApi();
const getComparisonUseCase = new GetComparisonUseCase(routeApi);

export function useComparison() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getComparisonUseCase.execute();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch comparison. Is baseline set?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  return { data, loading, error, refresh: fetchComparison };
}