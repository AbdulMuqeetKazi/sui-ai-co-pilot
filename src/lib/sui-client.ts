
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

// Supported networks
export const NETWORKS = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet',
  DEVNET: 'devnet',
  LOCAL: 'local',
};

// Get RPC URL for a network
export const getRpcUrl = (network: string) => {
  switch (network) {
    case NETWORKS.MAINNET:
      return getFullnodeUrl('mainnet');
    case NETWORKS.TESTNET:
      return getFullnodeUrl('testnet');
    case NETWORKS.DEVNET:
      return getFullnodeUrl('devnet');
    case NETWORKS.LOCAL:
      return 'http://localhost:9000';
    default:
      return getFullnodeUrl('testnet');
  }
};

// Create a SUI client for a network
export const createSuiClient = (network: string = NETWORKS.TESTNET) => {
  const rpcUrl = getRpcUrl(network);
  return new SuiClient({ url: rpcUrl });
};

// Get formatted balance with symbol
export const formatBalance = (balance: string | number, decimals: number = 9): string => {
  const value = typeof balance === 'string' ? parseFloat(balance) : balance;
  const formattedValue = (value / 10 ** decimals).toFixed(6);
  return `${formattedValue} SUI`;
};

// Create a sample transaction block
export const createSampleTransactionBlock = (recipient: string, amount: number) => {
  const txb = new TransactionBlock();
  const [coin] = txb.splitCoins(txb.gas, [txb.pure(amount)]);
  txb.transferObjects([coin], txb.pure(recipient));
  return txb;
};

// Get network explorer URL
export const getExplorerUrl = (network: string, path: string, id: string) => {
  let baseUrl = 'https://explorer.sui.io';
  
  if (network === NETWORKS.TESTNET) {
    baseUrl = 'https://testnet.suivision.xyz';
  } else if (network === NETWORKS.DEVNET) {
    baseUrl = 'https://explorer.sui.io/devnet';
  }
  
  return `${baseUrl}/${path}/${id}`;
};
