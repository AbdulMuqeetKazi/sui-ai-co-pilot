
import { useState, useRef } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { supabase } from '@/integrations/supabase/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface SimulationResult {
  success: boolean;
  gasEstimation?: {
    computationCost: string;
    storageCost: string;
    storageRebate: string;
    nonRefundableStorageFee: string;
  };
  effects?: any;
  error?: string;
}

export const useSimulation = (network: string) => {
  const wallet = useWallet();
  const { user } = useAuth();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('1000000');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  
  // Store the TransactionBlock in a ref to reuse between simulation and execution
  const transactionBlockRef = useRef<TransactionBlock | null>(null);
  
  const createTransactionBlock = () => {
    // Create a transaction block
    const txb = new TransactionBlock();
    const [coin] = txb.splitCoins(txb.gas, [txb.pure(parseInt(amount))]);
    txb.transferObjects([coin], txb.pure(recipient));
    
    // Store the txb in the ref for reuse
    transactionBlockRef.current = txb;
    
    return txb;
  };
  
  const handleSimulate = async () => {
    if (!wallet.account?.address || !wallet.connected || !recipient || !amount) {
      toast({
        title: "Simulation failed",
        description: "Please connect your wallet and enter recipient address and amount",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSimulating(true);
      setSimulationResult(null);
      
      // Create a transaction block and store in ref
      const txb = createTransactionBlock();
      
      // Serialize the transaction block for the simulation
      const serializedTxb = await txb.serialize();
      
      // Call the simulation endpoint with the serialized txb
      const { data, error } = await supabase.functions.invoke('runTransactionSim', {
        body: JSON.stringify({
          txb: serializedTxb,
          sender: wallet.account.address,
          network
        })
      });
      
      if (error) throw error;
      
      console.log('Simulation result:', data);
      
      setSimulationResult({
        success: data.success,
        gasEstimation: data.gasEstimation,
        effects: data.effects,
        error: data.result?.errors?.join(', ')
      });
      
      // Log simulation in the database
      if (user) {
        await supabase.from('transaction_logs').insert({
          user_id: user.id,
          status: data.success ? 'simulated' : 'failed',
          tx_hash: 'simulation-' + Date.now(),
          gas_used: data.gasEstimation?.computationCost || 0,
          details: {
            type: 'simulation',
            network,
            recipient,
            amount,
            result: data
          }
        });
      }
      
    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "Simulation failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      
      setSimulationResult({
        success: false,
        error: error.message || "Simulation failed"
      });
    } finally {
      setIsSimulating(false);
    }
  };
  
  const executeTransaction = async () => {
    if (!wallet.account?.address || !wallet.connected || !recipient || !amount) {
      toast({
        title: "Transaction failed",
        description: "Please connect your wallet and enter recipient address and amount",
        variant: "destructive"
      });
      return;
    }
    
    try {
      toast({
        title: "Preparing transaction",
        description: "Please confirm the transaction in your wallet"
      });
      
      // Use the existing transaction block from the ref or create a new one
      const txb = transactionBlockRef.current || createTransactionBlock();
      
      // Pass the TransactionBlock instance directly to signAndExecuteTransactionBlock
      // Cast to 'any' to bypass type checking since wallet-kit has its own Transaction type
      const result = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: txb as any,
      });
      
      console.log('Transaction result:', result);
      
      toast({
        title: "Transaction submitted",
        description: `Transaction digest: ${result.digest.slice(0, 10)}...`
      });
      
      // Log transaction in the database
      if (user) {
        await supabase.from('transaction_logs').insert({
          user_id: user.id,
          status: 'executed',
          tx_hash: result.digest,
          details: {
            network,
            recipient,
            amount,
            result
          }
        });
      }
      
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Transaction failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const getCodeExample = () => {
    return `// Transfer SUI to another address
import { TransactionBlock } from '@mysten/sui.js/transactions';

// Create a transaction block
const txb = new TransactionBlock();

// Split the coin from gas object and get the resulting coin
const [coin] = txb.splitCoins(txb.gas, [txb.pure(${amount})]);

// Transfer the split coin to the recipient
txb.transferObjects([coin], txb.pure('${recipient}'));

// Sign and execute the transaction
// This requires wallet connection
const result = await signAndExecuteTransactionBlock({
  transactionBlock: txb,
});

console.log('Transaction digest:', result.digest);`;
  };

  return {
    recipient,
    setRecipient,
    amount,
    setAmount,
    isSimulating,
    simulationResult,
    handleSimulate,
    executeTransaction,
    getCodeExample
  };
};
