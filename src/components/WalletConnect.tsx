import React, { useState } from 'react';
import { Wallet, AlertCircle } from 'lucide-react';
import { formatAddress, isSepoliaNetwork } from '../utils/ethereum';

interface WalletConnectProps {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  error: string | null;
  onConnect: () => Promise<void>;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  address,
  isConnected,
  chainId,
  error,
  onConnect
}) => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect();
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Wallet Connection</h2>
        {isConnected && chainId && !isSepoliaNetwork(chainId) && (
          <div className="flex items-center text-amber-600">
            <AlertCircle size={16} className="mr-1" />
            <span className="text-sm">Not connected to Sepolia Testnet</span>
          </div>
        )}
      </div>

      {isConnected && address ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <Wallet size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Connected Wallet</p>
              <p className="font-medium">{formatAddress(address)}</p>
            </div>
          </div>
          <div className="h-3 w-3 bg-green-400 rounded-full"></div>
        </div>
      ) : (
        <div>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
          {error && (
            <div className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;