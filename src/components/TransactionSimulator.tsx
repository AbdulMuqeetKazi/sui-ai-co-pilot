import React, { useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { supabase } from '@/integrations/supabase/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useAuth } from '@/contexts/AuthContext';
import { formatBalance } from '@/lib/sui-client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Play } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CodeOutput from './CodeOutput';
import { ScrollArea } from './ui/scroll-area';

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

const TransactionSimulator = ({ network }: { network: string }) => {
  const wallet = useWallet();
  const { user } = useAuth();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('1000000'); 
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
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
      
      // Create a transaction block
      const txb = new TransactionBlock();
      const [coin] = txb.splitCoins(txb.gas, [txb.pure(parseInt(amount))]);
      txb.transferObjects([coin], txb.pure(recipient));
      
      // Serialize the transaction block
      const serializedTxb = await txb.serialize();
      
      // Call the simulation endpoint
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
      
      // Create a transaction block
      const txb = new TransactionBlock();
      const [coin] = txb.splitCoins(txb.gas, [txb.pure(parseInt(amount))]);
      txb.transferObjects([coin], txb.pure(recipient));
      
      // Execute the transaction using wallet's method directly
      const result = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: txb,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Simulator</CardTitle>
        <CardDescription>
          Test transactions without spending real gas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isSimulating}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (in MIST)</Label>
          <div className="flex space-x-2">
            <Input
              id="amount"
              type="number"
              placeholder="1000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSimulating}
            />
            <Button
              variant="outline"
              onClick={() => setAmount('1000000000')}
              className="whitespace-nowrap"
              disabled={isSimulating}
            >
              1 SUI
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            1 SUI = 1,000,000,000 MIST
          </p>
        </div>
        
        <Button
          onClick={handleSimulate}
          disabled={isSimulating || !wallet.connected || !recipient || !amount}
          className="w-full"
        >
          {isSimulating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Simulate Transaction
            </>
          )}
        </Button>
        
        {simulationResult && (
          <div className="mt-4 space-y-4">
            <div className={`p-4 rounded-md ${
              simulationResult.success 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <h3 className="font-medium">
                {simulationResult.success ? 'Simulation Successful' : 'Simulation Failed'}
              </h3>
              {simulationResult.error && (
                <p className="mt-1 text-sm">{simulationResult.error}</p>
              )}
              {simulationResult.success && simulationResult.gasEstimation && (
                <div className="mt-2 text-sm">
                  <p>Gas Estimation:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Computation: {formatBalance(simulationResult.gasEstimation.computationCost, 9)}</li>
                    <li>Storage: {formatBalance(simulationResult.gasEstimation.storageCost, 9)}</li>
                    <li>Rebate: {formatBalance(simulationResult.gasEstimation.storageRebate, 9)}</li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
              
              {showDetails && (
                <ScrollArea className="h-60 rounded border p-4">
                  <pre className="text-xs">
                    {JSON.stringify(simulationResult.effects || {}, null, 2)}
                  </pre>
                </ScrollArea>
              )}
            </div>
            
            {simulationResult.success && (
              <div className="space-y-2">
                <Button
                  onClick={executeTransaction}
                  className="w-full"
                  disabled={!wallet.connected}
                >
                  Execute Real Transaction
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  This will require wallet confirmation and real gas fees
                </p>
              </div>
            )}
            
            <CodeOutput 
              code={getCodeExample()}
              language="typescript"
              title="Transaction Code Example"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionSimulator;
