import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/CharityFund';

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && window.ethereum !== undefined;
};

// Get Ethereum provider
export const getProvider = async (): Promise<ethers.BrowserProvider | null> => {
  if (!isMetaMaskInstalled()) {
    console.error('MetaMask is not installed');
    return null;
  }
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  } catch (error) {
    console.error('Error getting provider:', error);
    return null;
  }
};

// Get signer from provider
export const getSigner = async (): Promise<ethers.JsonRpcSigner | null> => {
  const provider = await getProvider();
  if (!provider) return null;
  
  try {
    const signer = await provider.getSigner();
    return signer;
  } catch (error) {
    console.error('Error getting signer:', error);
    return null;
  }
};

// Get contract instance
export const getContract = async (): Promise<ethers.Contract | null> => {
  const signer = await getSigner();
  if (!signer) return null;
  
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    return contract;
  } catch (error) {
    console.error('Error getting contract:', error);
    return null;
  }
};

// Format address for display
export const formatAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Format ETH amount for display
export const formatEth = (amount: string): string => {
  return parseFloat(ethers.formatEther(amount)).toFixed(4);
};

// Check if connected to Sepolia
export const isSepoliaNetwork = (chainId: number): boolean => {
  return chainId === 11155111; // Sepolia Chain ID
};