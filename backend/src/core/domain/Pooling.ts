
type PoolMemberInput = {
  ship_id: string;
  cb_before: number; 
};


export type PoolMemberResult = PoolMemberInput & {
  cb_after: number;
};

/**
 * Performs a greedy allocation of surplus from surplus ships
 * to deficit ships, as per FuelEU Article 21 rules.
 *
 * @param members An array of ships with their pre-pool compliance balance.
 * @returns An array of ships with their pre- and post-pool balance.
 * @throws Error if the pool is invalid (e.g., total balance is negative).
 */
export function allocatePoolSurplus(
  members: PoolMemberInput[]
): PoolMemberResult[] {
 
  const totalPoolBalance = members.reduce(
    (sum, m) => sum + m.cb_before,
    0
  );

  if (totalPoolBalance < 0) {
    throw new Error(
      `Pool is invalid. Total Compliance Balance is ${totalPoolBalance.toFixed(
        2
      )}, which is less than 0.`
    );
  }

  const memberMap = new Map<string, PoolMemberResult>(
    members.map((m) => [m.ship_id, { ...m, cb_after: m.cb_before }])
  );

  const deficitShips = [...memberMap.values()]
    .filter((m) => m.cb_after < 0)
    .sort((a, b) => a.cb_after - b.cb_after);

  const surplusShips = [...memberMap.values()]
    .filter((m) => m.cb_after > 0)
    .sort((a, b) => b.cb_after - a.cb_after);

  for (const deficitShip of deficitShips) {
    let remainingDeficit = Math.abs(deficitShip.cb_after);
    if (remainingDeficit <= 0) continue;

    for (const surplusShip of surplusShips) {
      if (remainingDeficit <= 0) break;

      const availableSurplus = surplusShip.cb_after;
      if (availableSurplus <= 0) continue; 

      const transferAmount = Math.min(remainingDeficit, availableSurplus);

    
      surplusShip.cb_after -= transferAmount;
      deficitShip.cb_after += transferAmount;
      
      remainingDeficit -= transferAmount;

      
      memberMap.set(surplusShip.ship_id, surplusShip);
      memberMap.set(deficitShip.ship_id, deficitShip);
    }
  }


  return Array.from(memberMap.values());
}