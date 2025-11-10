import { useRoutes } from '../hooks/useRoutes';

export default function RoutesTab() {
  const {
    routes,
    loading,
    error,
    filters,
    handleFilterChange,
    handleSetBaseline,
  } = useRoutes();

  const renderContent = () => {
    if (loading) {
      return <p className="text-gray-400">Loading routes...</p>;
    }
    if (error) {
      return <p className="text-red-500">{error}</p>;
    }
    if (routes.length === 0 && !loading) {
      return <p className="text-gray-400">No routes found or matching filters.</p>
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {/* Add column headers */}
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Route ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Baseline</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Vessel Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Fuel Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Year</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">GHG Intensity</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Fuel (t)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Distance (km)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Total Em. (t)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {routes.map(route => (
              <tr key={route.id} className="hover:bg-gray-800">
                <td className="px-4 py-3 text-sm">{route.route_id}</td>
                <td className="px-4 py-3 text-sm text-center">{route.is_baseline ? '✅' : ''}</td>
                <td className="px-4 py-3 text-sm">{route.vesselType}</td>
                <td className="px-4 py-3 text-sm">{route.fuelType}</td>
                <td className="px-4 py-3 text-sm">{route.year}</td>
                <td className="px-4 py-3 text-sm">{route.ghg_intensity.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm">{route.fuelConsumption.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{route.distance.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{route.totalEmissions.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleSetBaseline(route.route_id)}
                    disabled={route.is_baseline}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium
                               hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    Set Baseline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Section */}
      <div className="flex gap-4 p-4 bg-gray-800 rounded-lg">
        <h3 className="font-semibold my-auto">Filters:</h3>
        <input
          type="text"
          name="vesselType"
          placeholder="Vessel Type..."
          value={filters.vesselType}
          onChange={handleFilterChange}
          className="bg-gray-700 rounded-md px-3 py-1.5 text-sm"
        />
        <input
          type="text"
          name="fuelType"
          placeholder="Fuel Type..."
          value={filters.fuelType}
          onChange={handleFilterChange}
          className="bg-gray-700 rounded-md px-3 py-1.5 text-sm"
        />
        <input
          type="text"
          name="year"
          placeholder="Year..."
          value={filters.year}
          onChange={handleFilterChange}
          className="bg-gray-700 rounded-md px-3 py-1.5 text-sm"
        />
      </div>

      {/* Table Section */}
      <div className="bg-gray-800 p-4 rounded-lg">
        {renderContent()}
      </div>
    </div>
  );
}