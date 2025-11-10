import { useComparison } from '../hooks/useComparison';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

// Define interfaces for the data structure
interface ComparisonRoute {
  id: string | number;
  route_id: string;
  ghg_intensity: number;
  percentDiff: number;
  compliant: boolean;
}

interface Baseline {
  route_id: string;
  ghg_intensity: number;
  target_intensity: number;
}

interface ComparisonData {
  comparisons: ComparisonRoute[];
  baseline: Baseline;
}

interface UseComparisonResult {
  data: ComparisonData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export default function CompareTab() {
  const { data, loading, error }: UseComparisonResult = useComparison();

  // Format data for the chart
  const chartData = data?.comparisons.map(route => ({
    name: route.route_id,
    'GHG Intensity': route.ghg_intensity,
    'Target': data.baseline.target_intensity,
    'Baseline': data.baseline.ghg_intensity,
  }));

  const renderContent = () => {
    if (loading) {
      return <p className="text-gray-400">Loading comparison data...</p>;
    }
    if (error) {
      return <p className="text-red-500">{error}</p>;
    }
    if (!data) {
      return <p className="text-gray-400">No data available.</p>;
    }

    return (
      <div className="flex flex-col gap-6">
        
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-gray-400 uppercase">Baseline Route</h4>
            <p className="text-2xl font-semibold">{data.baseline.route_id}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-gray-400 uppercase">Baseline Intensity</h4>
            <p className="text-2xl font-semibold">{data.baseline.ghg_intensity.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-gray-400 uppercase">2025 Target</h4>
            <p className="text-2xl font-semibold text-green-400">{data.baseline.target_intensity.toFixed(2)}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-gray-800 p-4 rounded-lg h-80">
          <h3 className="text-lg font-semibold mb-4">GHG Intensity Comparison (gCO₂e/MJ)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }} />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar dataKey="GHG Intensity" fill="#3B82F6" />
              <Bar dataKey="Baseline" fill="#EF4444" />
              <Bar dataKey="Target" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Comparison Details</h3>
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Route ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">GHG Intensity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">% Difference</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Compliant (vs Target)</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {data.comparisons.map(route => (
                <tr key={route.id} className="hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm">{route.route_id}</td>
                  <td className="px-4 py-3 text-sm">{route.ghg_intensity.toFixed(2)}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${route.percentDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {route.percentDiff.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    {route.compliant ? '✅' : '❌'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {renderContent()}
    </div>
  );
}