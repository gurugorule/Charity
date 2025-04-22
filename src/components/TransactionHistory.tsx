import React from 'react';
import { History, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { DonationLog, CharityTransfer } from '../types';
import { formatAddress } from '../utils/ethereum';

interface TransactionHistoryProps {
  donations: DonationLog[];
  transfers: CharityTransfer[];
  isLoading: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  donations,
  transfers,
  isLoading
}) => {
  // Combine and sort transactions by timestamp
  const allTransactions = [
    ...donations.map(d => ({ 
      ...d, 
      type: 'donation' as const 
    })),
    ...transfers.map(t => ({ 
      ...t, 
      type: 'transfer' as const 
    }))
  ].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderSkeletonLoader = () => {
    return Array(3).fill(0).map((_, idx) => (
      <div key={idx} className="border-b border-gray-100 p-4 animate-pulse">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 rounded-full bg-gray-200 mr-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <History size={20} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
        </div>
      </div>

      <div className="overflow-y-auto max-h-80">
        {isLoading ? (
          renderSkeletonLoader()
        ) : allTransactions.length > 0 ? (
          allTransactions.map((tx, idx) => (
            <div key={idx} className="border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  {tx.type === 'donation' ? (
                    <ArrowDownCircle size={16} className="text-green-600 mr-2" />
                  ) : (
                    <ArrowUpCircle size={16} className="text-blue-600 mr-2" />
                  )}
                  <span className="font-medium">
                    {tx.type === 'donation' ? 'Donation' : 'Transfer to Charity'}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{formatDate(tx.timestamp)}</span>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <div className="text-sm text-gray-600">
                  {tx.type === 'donation' 
                    ? `From: ${formatAddress(tx.donor)}`
                    : `To: ${formatAddress(tx.recipient)}`
                  }
                </div>
                <div className="font-medium">
                  {tx.type === 'donation' ? tx.amount : tx.totalTransferred} ETH
                </div>
              </div>
              
              <div className="mt-1">
                <a 
                  href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View on Etherscan
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;