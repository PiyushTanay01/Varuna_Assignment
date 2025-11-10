import { useState } from 'react';

// 1. IMPORT THE NEW TAB
import RoutesTab from './adapters/ui/components/RoutesTab';
import CompareTab from './adapters/ui/components/CompareTab';
import BankingTab from './adapters/ui/components/BankingTab';
import PoolingTab from './adapters/ui/components/PoolingTab';

type Tab = 'Routes' | 'Compare' | 'Banking' | 'Pooling';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Routes');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Routes':
        // 2. RENDER THE COMPONENT
        return <RoutesTab />;
      case 'Compare':
        return <CompareTab />;
      case 'Banking':
        return <BankingTab />;
      case 'Pooling':
        return <PoolingTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">FuelEU Maritime Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        {(['Routes', 'Compare', 'Banking', 'Pooling'] as Tab[]).map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium transition-colors duration-150 ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-400'
                : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default App;