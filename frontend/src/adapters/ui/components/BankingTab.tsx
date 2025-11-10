import { useBanking } from "../hooks/useBanking";

// Hardcoded list of ships from our seed data
const SHIPS = ['R1000', 'R1001', 'R1002', 'R1003', 'R1004'];

export default function BankingTab() {
  const {
    status,
    loading,
    error,
    actionError,
    shipId,
    setShipId,
    year,
    applyAmount,
    setApplyAmount,
    fetchStatus,
    handleCalculateCB,
    handleBankSurplus,
    handleApplySurplus,
  } = useBanking();

  // Helper to format large numbers
  const formatCB = (num: number) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Ship Selector */}
      <div className="bg-gray-800 p-4 rounded-lg flex gap-4 items-center">
        <label htmlFor="shipId" className="font-medium">Select Ship:</label>
        <select
          id="shipId"
          value={shipId}
          onChange={(e) => setShipId(e.target.value)}
          className="bg-gray-700 rounded-md px-3 py-2 text-sm"
        >
          {SHIPS.map(id => <option key={id} value={id}>{id}</option>)}
        </select>
        {/* We hardcode year 2025, but this could be an input */}
        <input type="hidden" value={year} />

        <button
          onClick={fetchStatus}
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-500"
        >
          Fetch Status
        </button>
        <button
          onClick={handleCalculateCB}
          className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-500"
        >
          Force Calculate CB
        </button>
      </div>

      {/* 2. Status Display */}
      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-yellow-500">{error}</p>}
      {status && (
        <div className="flex flex-col gap-6">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h4 className="text-sm font-medium text-gray-400 uppercase">CB Before (Raw)</h4>
              <p className={`text-2xl font-semibold ${status.cb_before < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {formatCB(status.cb_before)}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h4 className="text-sm font-medium text-gray-400 uppercase">Applied/Banked (This Year)</h4>
              <p className="text-2xl font-semibold">{formatCB(status.applied_or_banked)}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h4 className="text-sm font-medium text-gray-400 uppercase">CB After (Adjusted)</h4>
              <p className={`text-2xl font-semibold ${status.cb_after < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {formatCB(status.cb_after)}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h4 className="text-sm font-medium text-gray-400 uppercase">Total Available Bank</h4>
              <p className="text-2xl font-semibold text-blue-400">
                {formatCB(status.total_available_bank)}
              </p>
            </div>
          </div>
          
          {actionError && <p className="bg-red-900/50 text-red-300 p-3 rounded-md">{actionError}</p>}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-6">
            {/* Bank Surplus */}
            <div className="bg-gray-800 p-4 rounded-lg flex flex-col gap-3">
              <h3 className="text-lg font-semibold">Bank Surplus (Art. 20)</h3>
              <p className="text-sm text-gray-400">
                Move this ship's surplus (positive CB) into the bank for future use.
              </p>
              <button
                onClick={handleBankSurplus}
                disabled={status.cb_before <= 0}
                className="bg-green-600 text-white px-4 py-2 rounded-md font-medium
                           hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Bank Surplus
              </button>
            </div>

            {/* Apply Surplus */}
            <div className="bg-gray-800 p-4 rounded-lg flex flex-col gap-3">
              <h3 className="text-lg font-semibold">Apply Banked Surplus</h3>
              <p className="text-sm text-gray-400">
                Use this ship's available bank to cover its deficit (negative CB).
              </p>
              <input
                type="number"
                value={applyAmount}
                onChange={(e) => setApplyAmount(e.target.value)}
                className="bg-gray-700 rounded-md px-3 py-2 text-sm"
                placeholder="Amount to apply"
              />
              <button
                onClick={handleApplySurplus}
                disabled={status.cb_before >= 0 || status.total_available_bank <= 0}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium
                           hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Apply from Bank
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}