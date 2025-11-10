import type { IPoolApi } from '../ports/IPoolApi';
import type { Pool } from '../domain/Pooling';

// Using the long-form constructor to avoid tsconfig issues
export class CreatePoolUseCase {
  private api: IPoolApi;
  constructor(api: IPoolApi) { this.api = api; }

  async execute(shipIds: string[], year: number): Promise<Pool> {
    return this.api.createPool(shipIds, year);
  }
}