import axios from 'axios';
import type { Route } from '../../../core/domain/route';
import type { IRouteApi } from '../../../core/ports/IRouteApi';
import { ComparisonData } from '../../../core/domain/RouteComparison';
// Create a single, configured axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Your backend URL
});

export class RouteApi implements IRouteApi {
    async getComparison(): Promise<ComparisonData> {
        try {
        const response = await apiClient.get('/routes/comparison');
        return response.data;
        } catch (error) {
        console.error('Failed to fetch comparison data:', error);
        throw new Error('Failed to fetch comparison data');
        }
    }

    async getAllRoutes(): Promise<Route[]> {
    try {
      const response = await apiClient.get('/routes');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      throw new Error('Failed to fetch routes');
    }
  }

  async setBaseline(routeId: string): Promise<Route> {
    try {
      const response = await apiClient.post(`/routes/${routeId}/baseline`);
      return response.data;
    } catch (error) {
      console.error('Failed to set baseline:', error);
      throw new Error('Failed to set baseline');
    }
  }
}