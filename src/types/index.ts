// Ethereum related types
export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

export interface ContractState {
  balance: string;
  threshold: string;
  totalAmount: string;
  isLoading: boolean;
  owner: string | null;
}

// API related types
export interface DonationLog {
  donor: string;
  amount: string;
  txHash: string;
  timestamp: string;
  _id: string;
}

export interface CharityTransfer {
  recipient: string;
  totalTransferred: string;
  txHash: string;
  timestamp: string;
  _id: string;
}

export interface LogsResponse {
  success: boolean;
  donations: DonationLog[];
  transfers: CharityTransfer[];
  error?: string;
}