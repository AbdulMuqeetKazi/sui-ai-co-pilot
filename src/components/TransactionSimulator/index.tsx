
import React from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SimulationForm from './SimulationForm';
import SimulationResult from './SimulationResult';
import { useSimulation } from './useSimulation';

const TransactionSimulator = ({ network }: { network: string }) => {
  const wallet = useWallet();
  const {
    recipient,
    setRecipient,
    amount,
    setAmount,
    isSimulating,
    simulationResult,
    handleSimulate,
    executeTransaction,
    getCodeExample
  } = useSimulation(network);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Simulator</CardTitle>
        <CardDescription>
          Test transactions without spending real gas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SimulationForm
          recipient={recipient}
          setRecipient={setRecipient}
          amount={amount}
          setAmount={setAmount}
          isSimulating={isSimulating}
          onSimulate={handleSimulate}
        />
        
        {simulationResult && (
          <SimulationResult
            result={simulationResult}
            onExecute={executeTransaction}
            showExecuteButton={wallet.connected}
            codeExample={getCodeExample()}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionSimulator;
