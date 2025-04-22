import React, { useState } from 'react';
import { Heart, AlertCircle, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';
import { TransactionStatus } from '../types';

interface DonationFormProps {
  isConnected: boolean;
  onDonate: (amount: string) => Promise<boolean>;
  threshold: string;
}

const DonationForm: React.FC<DonationFormProps> = ({
  isConnected,
  onDonate,
  threshold
}) => {
  const [amount, setAmount] = useState<string>('0.01');
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('pending');
    setError(null);

    try {
      const success = await onDonate(amount);
      setStatus(success ? 'success' : 'error');
      if (!success) setError('Transaction failed');
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Transaction failed');
    }
  };

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet First';
    switch (status) {
      case 'pending': return 'Processing...';
      case 'success': return 'Donation Successful!';
      case 'error': return 'Try Again';
      default: return 'Donate ETH';
    }
  };

  const getButtonClasses = () => {
    let classes = 'w-full px-4 py-3 rounded-md font-medium transition-all duration-300 flex items-center justify-center';
    
    if (!isConnected) {
      return `${classes} bg-gray-400 cursor-not-allowed text-white`;
    }
    
    switch (status) {
      case 'pending':
        return `${classes} bg-blue-600 text-white`;
      case 'success':
        return `${classes} bg-green-600 text-white`;
      case 'error':
        return `${classes} bg-red-600 text-white`;
      default:
        return `${classes} bg-blue-600 hover:bg-blue-700 text-white`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 bg-rose-100 rounded-full flex items-center justify-center mr-3">
          <Heart size={20} className="text-rose-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Make a Donation</h2>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm">
        <p className="text-blue-800">
          Threshold: <span className="font-medium">{threshold} ETH</span>
          <br />
          When the total reaches this amount, funds will automatically transfer to the charity owner.
        </p>
      </div>

      <form onSubmit={handleDonate}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (ETH)
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              step="0.001"
              min="0.001"
              value={amount}
              onChange={handleAmountChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={status === 'pending'}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">ETH</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isConnected || status === 'pending' || parseFloat(amount) <= 0}
          className={getButtonClasses()}
        >
          {status === 'pending' && <Loader2 size={18} className="animate-spin mr-2" />}
          {getButtonText()}
        </button>
      </form>

      {status === 'success' && (
        <div className="mt-4 p-3 bg-green-50 rounded-md text-sm text-green-800 flex items-start">
          <div className="mt-0.5 mr-2 flex-shrink-0">
            <div className="h-4 w-4 bg-green-200 rounded-full flex items-center justify-center">
              <div className="h-2 w-2 bg-green-600 rounded-full"></div>
            </div>
          </div>
          <p>Your donation was successful! Thank you for your generosity.</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 rounded-md text-sm text-red-800 flex items-start">
          <AlertCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default DonationForm;