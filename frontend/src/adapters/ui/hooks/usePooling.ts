import { useState, useEffect, useMemo, useCallback } from 'react';
import type { BankingStatus } from '../../../core/domain/Banking';
import type { Pool } from '../../../core/domain/Pooling';
import { ComplianceApi } from '../../infrastructure/api/ComplianceApi';
import { PoolApi } from '../../infrastructure/api/PoolApi';
import { GetBankingStatusUseCase } from '../../../core/application/ComplianceUseCases';
import { CreatePoolUseCase } from '../../../core/application/PoolUseCases';

// Instantiate singletons
const complianceApi = new ComplianceApi();
const getBankingStatusUseCase = new GetBankingStatusUseCase(complianceApi);
const poolApi = new PoolApi();
const createPoolUseCase = new CreatePoolUseCase(poolApi);

// Get the list of ships from our seed data
const ALL_SHIPS = ['R1000', 'R1001', 'R1002', 'R1003', 'R1004'];
const YEAR = 2025;

export function usePooling() {
  const [shipStatuses, setShipStatuses] = useState<Map<string, BankingStatus>>(new Map());
  const [selectedShips, setSelectedShips] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [poolResult, setPoolResult] = useState<Pool | null>(null);

  // Fetch status for ALL ships on load
  const fetchAllStatuses = useCallback(async () => {
    setLoading(true);
    try {
      // First, ensure all ships have a CB record by calling calculate
      await Promise.all(
        ALL_SHIPS.map(id => 
          complianceApi.calculateCB(id, YEAR).catch(() => {}) // Ignore errors
        )
      );

      // Now, get the adjusted status for all
      const statuses = await Promise.all(
        ALL_SHIPS.map(id => getBankingStatusUseCase.execute(id, YEAR))
      );
      
      const statusMap = new Map<string, BankingStatus>();
      statuses.forEach(status => {
        statusMap.set(status.ship_id, status);
      });
      setShipStatuses(statusMap);
    } catch (err) {
      setError('Failed to fetch ship statuses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStatuses();
  }, [fetchAllStatuses]);

  // Handle ship selection
  const handleSelectShip = (shipId: string) => {
    setSelectedShips(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shipId)) {
        newSet.delete(shipId);
      } else {
        newSet.add(shipId);
      }
      return newSet;
    });
    setPoolResult(null); // Clear old results
    setError(null);
  };

  // Calculate Pool Sum
  const poolSum = useMemo(() => {
    let sum = 0;
    selectedShips.forEach(shipId => {
      // We use the `cb_before` (raw CB) from the banking status,
      // which is what our backend `CreatePoolUseCase` expects.
      const status = shipStatuses.get(shipId);
      if (status) {
        sum += status.cb_before;
      }
    });
    return sum;
  }, [selectedShips, shipStatuses]);

  // Handle Pool Creation
  const handleCreatePool = async () => {
    setError(null);
    setPoolResult(null);
    setLoading(true);
    try {
      const shipIds = Array.from(selectedShips);
      const result = await createPoolUseCase.execute(shipIds, YEAR);
      setPoolResult(result);
      // Refresh all statuses to show new "adjusted" balances
      await fetchAllStatuses();
    } catch (err: any) {
      setError(err.response?.data?.error || (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    shipStatuses,
    selectedShips,
    poolSum,
    poolResult,
    loading,
    error,
    handleSelectShip,
    handleCreatePool,
  };
}