export type { ShipCompliance, BankEntry } from '@prisma/client';

export const TARGET_INTENSITY_2025 = 89.3368; 
export const ENERGY_CONVERSION_FACTOR = 41000;

/**
 * Calculates the Compliance Balance (CB) based on the core formula.
 * @param actualIntensity - The ship's actual GHG intensity (gCO2e/MJ)
 * @param fuelConsumption - The ship's fuel consumption (t)
 * @returns The Compliance Balance (CB). Positive is surplus, negative is deficit.
 */
export function calculateComplianceBalance(
  actualIntensity: number,
  fuelConsumption: number
): number {
  
  const energyInScope = fuelConsumption * ENERGY_CONVERSION_FACTOR;
  
  const complianceBalance =
    (TARGET_INTENSITY_2025 - actualIntensity) * energyInScope;

  return complianceBalance;
}

