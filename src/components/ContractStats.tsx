import React from 'react';
import { LineChart, Coins } from 'lucide-react';
import { ContractState } from '../types';

interface ContractStatsProps {
  contractState: ContractState;
  onRefresh: () => Promise<void>;
}

const ContractStats: React.FC<ContractStatsProps> = ({
  contractState,
  onRefresh
}) => {
  const { balance, totalAmount, isLoading } = contractState;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
            <LineChart size={20} className="text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Contract Stats</h2>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Coins size={16} className="text-amber-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Contract Balance</span>
          </div>
          <div className="text-xl font-semibold">
            {isLoading ? (
              <div className="h-7 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>{balance} ETH</>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <LineChart size={16} className="text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Current Total</span>
          </div>
          <div className="text-xl font-semibold">
            {isLoading ? (
              <div className="h-7 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <>{totalAmount} ETH</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractStats;