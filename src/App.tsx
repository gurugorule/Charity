import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { HeartHandshake } from 'lucide-react';
import WalletConnect from './components/WalletConnect';
import DonationForm from './components/DonationForm';
import ContractStats from './components/ContractStats';
import TransactionHistory from './components/TransactionHistory';
import { getProvider, getContract, isMetaMaskInstalled, isSepoliaNetwork } from './utils/ethereum';
import { logDonation, logCharityTransfer, getAllLogs } from './utils/api';
import { WalletState, ContractState, DonationLog, CharityTransfer } from './types';

function App() {
  // Wallet state
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    isConnecting: false,
    error: null,
  });

  // Contract state
  const [contractState, setContractState] = useState<ContractState>({
    balance: '0',
    threshold: '0.05',
    totalAmount: '0',
    isLoading: true,
    owner: null,
  });

  // Transaction logs
  const [donations, setDonations] = useState<DonationLog[]>([]);
  const [transfers, setTransfers] = useState<CharityTransfer[]>([]);
  const [logsLoading, setLogsLoading] = useState<boolean>(true);

  // Check MetaMask on load
  useEffect(() => {
    if (!isMetaMaskInstalled()) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask to use this application.'
      }));
    }
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask to use this application.'
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const provider = await getProvider();
      if (!provider) throw new Error('Failed to get provider');

      // Request account access
      const accounts = await provider.send('eth_requestAccounts', []);
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      const networkData = await provider.getNetwork();
      const chainId = Number(networkData.chainId);

      setWalletState({
        address,
        isConnected: true,
        chainId,
        isConnecting: false,
        error: null,
      });

      // Setup listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Fetch contract data
      await fetchContractData();
      await fetchTransactionLogs();
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setWalletState({
        address: null,
        isConnected: false,
        chainId: null,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      });
    }
  };

  // Handle account change
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      setWalletState({
        address: null,
        isConnected: false,
        chainId: null,
        isConnecting: false,
        error: null,
      });
    } else {
      // Account changed
      setWalletState(prev => ({
        ...prev,
        address: accounts[0],
      }));
    }
  };

  // Handle chain change
  const handleChainChanged = (chainId: string) => {
    setWalletState(prev => ({
      ...prev,
      chainId: parseInt(chainId, 16),
    }));
    
    // Reload the page to avoid any issues
    window.location.reload();
  };

  // Fetch contract data
  const fetchContractData = async () => {
    setContractState(prev => ({ ...prev, isLoading: true }));

    try {
      const contract = await getContract();
      if (!contract) throw new Error('Failed to get contract');

      const [balance, threshold, totalAmount, owner] = await Promise.all([
        contract.getContractBalance(),
        contract.threshold(),
        contract.totalAmount(),
        contract.owner(),
      ]);

      setContractState({
        balance: ethers.formatEther(balance),
        threshold: ethers.formatEther(threshold),
        totalAmount: ethers.formatEther(totalAmount),
        isLoading: false,
        owner,
      });
    } catch (error) {
      console.error('Error fetching contract data:', error);
      setContractState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Fetch transaction logs
  const fetchTransactionLogs = async () => {
    setLogsLoading(true);
    try {
      const response = await getAllLogs();
      if (response.success) {
        setDonations(response.donations);
        setTransfers(response.transfers);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  // Handle donation
  const handleDonate = async (amount: string): Promise<boolean> => {
    try {
      const contract = await getContract();
      if (!contract) throw new Error('Failed to get contract');

      const parsedAmount = ethers.parseEther(amount);
      const tx = await contract.deposit({ value: parsedAmount });
      const receipt = await tx.wait();

      // Log donation to backend
      if (receipt && walletState.address) {
        await logDonation(
          walletState.address,
          amount,
          receipt.hash
        );

        // Check if funds were transferred to owner
        const transferEvent = receipt.logs.find(
          log => log.eventName === 'FundsTransferred'
        );

        if (transferEvent && contractState.owner) {
          await logCharityTransfer(
            contractState.owner,
            ethers.formatEther(transferEvent.args[1]),
            receipt.hash
          );
        }
      }

      // Refresh data
      await fetchContractData();
      await fetchTransactionLogs();
      
      return true;
    } catch (error: any) {
      console.error('Error during donation:', error);
      throw new Error(error.message || 'Transaction failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <HeartHandshake size={32} className="text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Charity DApp</h1>
            </div>
            <div className="text-sm text-gray-600">
              Ethereum Sepolia Testnet
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Support Our Charity</h2>
              <p className="text-gray-600 mb-6">
                Your donations help us make a difference. All funds are securely processed through the Ethereum blockchain, 
                ensuring transparency and accountability.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-600 font-bold text-xl mb-1">Transparent</div>
                  <p className="text-sm text-gray-600">All transactions recorded on the blockchain</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-green-600 font-bold text-xl mb-1">Secure</div>
                  <p className="text-sm text-gray-600">Smart contract ensures safe fund transfers</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-purple-600 font-bold text-xl mb-1">Efficient</div>
                  <p className="text-sm text-gray-600">Low overhead means more impact</p>
                </div>
              </div>
            </div>

            <WalletConnect
              address={walletState.address}
              isConnected={walletState.isConnected}
              chainId={walletState.chainId}
              error={walletState.error}
              onConnect={connectWallet}
            />

            <ContractStats
              contractState={contractState}
              onRefresh={fetchContractData}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <DonationForm
              isConnected={walletState.isConnected}
              onDonate={handleDonate}
              threshold={contractState.threshold}
            />

            <TransactionHistory
              donations={donations}
              transfers={transfers}
              isLoading={logsLoading}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>Ethereum Charity DApp - Running on Sepolia Testnet</p>
            <p className="mt-2">
              <a 
                href="https://faucet.sepolia.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Get Test ETH
              </a> | 
              <a 
                href="https://sepolia.etherscan.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-2"
              >
                Sepolia Explorer
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;