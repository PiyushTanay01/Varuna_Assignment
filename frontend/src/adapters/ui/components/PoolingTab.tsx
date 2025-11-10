import { usePooling } from '../hooks/usePooling';

export default function PoolingTab() {
  const {
    shipStatuses,
    selectedShips,
    poolSum,
    poolResult,
    loading,
    error,
    handleSelectShip,
    handleCreatePool,
  } = usePooling();

  const formatCB = (num: number) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left Column: Ship Selection */}
      <div className="col-span-1 bg-gray-800 p-4 rounded-lg flex flex-col gap-3">
        <h3 className="text-lg font-semibold">1. Select Pool Members</h3>
        {loading && <p className="text-gray-400">Loading ship data...</p>}
        
        <div className="flex flex-col gap-2">
          {[...shipStatuses.entries()].map(([shipId, status]) => (
            <label
              key={shipId}
              className="flex items-center gap-3 p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600"
            >
              <input
                type="checkbox"
                checked={selectedShips.has(shipId)}
                onChange={() => handleSelectShip(shipId)}
                className="h-4 w-4 rounded bg-gray-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium">{shipId}</span>
              <span className="ml-auto text-sm">
                Raw CB: 
                <span className={`font-bold ml-1 ${status.cb_before < 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {formatCB(status.cb_before)}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Right Column: Actions & Results */}
      <div className="col-span-2 flex flex-col gap-6">
        {/* Action Box */}
        <div className="bg-gray-800 p-4 rounded-lg flex flex-col gap-4">
          <h3 className="text-lg font-semibold">2. Create Pool</h3>
          <div className="flex items-center gap-4">
            <div className="text-center bg-gray-700 p-3 rounded-lg flex-1">
              <h4 className="text-sm font-medium text-gray-400 uppercase">Pool Sum (Raw CB)</h4>
              <p className={`text-2xl font-semibold ${poolSum < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {formatCB(poolSum)}
              </p>
            </div>
            <button
              onClick={handleCreatePool}
              disabled={poolSum < 0 || selectedShips.size === 0 || loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium h-full
                         hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Create Pool
            </button>
          </div>
          {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md">{error}</p>}
        </div>

        {/* Results Box */}
        {poolResult && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Pool Results (ID: {poolResult.id})</h3>
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Ship ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">CB Before</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">CB After</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {poolResult.members.map(member => (
                  <tr key={member.id} className="hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm font-medium">{member.ship_id}</td>
                    <td className={`px-4 py-3 text-sm ${member.cb_before < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {formatCB(member.cb_before)}
                    </td>
                    <td className={`px-4 py-3 text-sm font-bold ${member.cb_after < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {formatCB(member.cb_after)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}