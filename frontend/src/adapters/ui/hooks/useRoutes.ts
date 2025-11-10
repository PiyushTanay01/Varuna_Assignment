import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Route } from '../../../core/domain/route';
import { RouteApi } from '../../infrastructure/api/RouteApi';
import { GetRoutesUseCase, SetBaselineUseCase } from '../../../core/application/RouteUseCases';

// --- Instantiate our dependencies outside the hook ---
// This ensures they are singletons for the app's lifecycle
const routeApi = new RouteApi();
const getRoutesUseCase = new GetRoutesUseCase(routeApi);
const setBaselineUseCase = new SetBaselineUseCase(routeApi);

// --- Define the filter state shape ---
interface RouteFilters {
  vesselType: string;
  fuelType: string;
  year: string;
}

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RouteFilters>({
    vesselType: '',
    fuelType: '',
    year: '',
  });

  // --- Data Fetching ---
  const fetchRoutes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRoutesUseCase.execute();
      setRoutes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch routes. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  // --- Actions ---
  const handleSetBaseline = useCallback(async (routeId: string) => {
    try {
      await setBaselineUseCase.execute(routeId);
      // Refresh the data to show the change
      await fetchRoutes();
    } catch (err) {
      alert('Failed to set baseline.');
    }
  }, [fetchRoutes]);

  // --- Filtering ---
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter(route => {
      const yearMatch = filters.year
        ? route.year.toString() === filters.year
        : true;
      const vesselMatch = filters.vesselType
        ? route.vesselType.toLowerCase().includes(filters.vesselType.toLowerCase())
        : true;
      const fuelMatch = filters.fuelType
        ? route.fuelType.toLowerCase().includes(filters.fuelType.toLowerCase())
        : true;
      return yearMatch && vesselMatch && fuelMatch;
    });
  }, [routes, filters]);

  return {
    routes: filteredRoutes,
    loading,
    error,
    filters,
    handleFilterChange,
    handleSetBaseline,
  };
}