import { useState, useCallback } from 'react';
import type { BankingStatus } from '../../../core/domain/Banking';
import { ComplianceApi } from '../../infrastructure/api/ComplianceApi';
import {
  GetBankingStatusUseCase,
  CalculateCBUseCase,
  BankSurplusUseCase,
  ApplySurplusUseCase,
} from '../../../core/application/ComplianceUseCases';

// Instantiate singletons
const api = new ComplianceApi();
const getBankingStatusUseCase = new GetBankingStatusUseCase(api);
const calculateCBUseCase = new CalculateCBUseCase(api);
const bankSurplusUseCase = new BankSurplusUseCase(api);
const applySurplusUseCase = new ApplySurplusUseCase(api);

export function useBanking() {
  const [status, setStatus] = useState<BankingStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [shipId, setShipId] = useState('R1001'); // Default to a known ship
  const [year, setYear] = useState(2025);
  const [applyAmount, setApplyAmount] = useState('0');

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    setError(null);
    try {
      const result = await getBankingStatusUseCase.execute(shipId, year);
      setStatus(result);
    } catch (err) {
      setError('Failed to fetch status. Try calculating CB first.');
    } finally {
      setLoading(false);
    }
  }, [shipId, year]);

  const handleCalculateCB = async () => {
    setLoading(true);
    setActionError(null);
    try {
      await calculateCBUseCase.execute(shipId, year);
      await fetchStatus(); // Refresh status after calculation
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleBankSurplus = async () => {
    setActionError(null);
    try {
      await bankSurplusUseCase.execute(shipId, year);
      await fetchStatus(); // Refresh status
    } catch (err: any) {
      setActionError(err.response?.data?.error || (err as Error).message);
    }
  };

  const handleApplySurplus = async () => {
    setActionError(null);
    const amount = parseFloat(applyAmount);
    if (isNaN(amount) || amount <= 0) {
      setActionError('Please enter a valid amount > 0.');
      return;
    }
    try {
      await applySurplusUseCase.execute(shipId, year, amount);
      setApplyAmount('0'); // Reset field
      await fetchStatus(); // Refresh status
    } catch (err: any) {
      setActionError(err.response?.data?.error || (err as Error).message);
    }
  };

  return {
    status,
    loading,
    error,
    actionError,
    shipId,
    setShipId,
    year,
    setYear,
    applyAmount,
    setApplyAmount,
    fetchStatus,
    handleCalculateCB,
    handleBankSurplus,
    handleApplySurplus,
  };
}