
import React from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SimulationFormProps {
  recipient: string;
  setRecipient: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  isSimulating: boolean;
  onSimulate: () => void;
}

const SimulationForm = ({
  recipient,
  setRecipient,
  amount,
  setAmount,
  isSimulating,
  onSimulate
}: SimulationFormProps) => {
  const wallet = useWallet();
  
  return (
    <div className="space-y-4">
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
        onClick={onSimulate}
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
    </div>
  );
};

export default SimulationForm;
