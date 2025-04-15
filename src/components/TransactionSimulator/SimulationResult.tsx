
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatBalance } from '@/lib/sui-client';
import CodeOutput from '../CodeOutput';

interface SimulationResultProps {
  result: {
    success: boolean;
    gasEstimation?: {
      computationCost: string;
      storageCost: string;
      storageRebate: string;
      nonRefundableStorageFee: string;
    };
    effects?: any;
    error?: string;
  };
  onExecute: () => void;
  showExecuteButton: boolean;
  codeExample: string;
}

const SimulationResult = ({ 
  result, 
  onExecute, 
  showExecuteButton,
  codeExample 
}: SimulationResultProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="mt-4 space-y-4">
      <div className={`p-4 rounded-md ${
        result.success 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}>
        <h3 className="font-medium">
          {result.success ? 'Simulation Successful' : 'Simulation Failed'}
        </h3>
        {result.error && (
          <p className="mt-1 text-sm">{result.error}</p>
        )}
        {result.success && result.gasEstimation && (
          <div className="mt-2 text-sm">
            <p>Gas Estimation:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Computation: {formatBalance(result.gasEstimation.computationCost, 9)}</li>
              <li>Storage: {formatBalance(result.gasEstimation.storageCost, 9)}</li>
              <li>Rebate: {formatBalance(result.gasEstimation.storageRebate, 9)}</li>
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
              {JSON.stringify(result.effects || {}, null, 2)}
            </pre>
          </ScrollArea>
        )}
      </div>
      
      {result.success && showExecuteButton && (
        <div className="space-y-2">
          <Button
            onClick={onExecute}
            className="w-full"
          >
            Execute Real Transaction
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            This will require wallet confirmation and real gas fees
          </p>
        </div>
      )}
      
      <CodeOutput 
        code={codeExample}
        language="typescript"
        title="Transaction Code Example"
      />
    </div>
  );
};

export default SimulationResult;
