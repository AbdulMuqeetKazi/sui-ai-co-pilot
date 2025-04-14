
import { useState } from 'react';
import { TransactionBlock } from '@mysten/sui.js';
import { useWallet } from '@suiet/wallet-kit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createSampleTransactionBlock, getExplorerUrl } from '@/lib/sui-client';
import { toast } from '@/hooks/use-toast';
import { ExternalLink, Send } from 'lucide-react';

interface SuiTransactionFormProps {
  network: string;
}

const SuiTransactionForm = ({ network }: SuiTransactionFormProps) => {
  const { connected, signAndExecuteTransactionBlock } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !recipient || !amount) return;

    try {
      setIsSubmitting(true);
      // Convert amount to MIST (smallest unit in Sui, 1 SUI = 10^9 MIST)
      const amountInMist = Math.floor(parseFloat(amount) * 10 ** 9);
      
      const txb = createSampleTransactionBlock(recipient, amountInMist);
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
      });

      setTxHash(result.digest);
      toast({
        title: 'Transaction successful',
        description: 'Your transaction has been submitted to the network.',
      });
      
      // Reset form
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: 'Transaction failed',
        description: error instanceof Error ? error.message : 'An error occurred while submitting the transaction.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const viewTransaction = () => {
    if (txHash) {
      const url = getExplorerUrl(network, 'txblock', txHash);
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Send SUI</CardTitle>
        <CardDescription>Transfer SUI tokens to another address</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
              disabled={!connected || isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (SUI)</Label>
            <Input
              id="amount"
              type="number"
              step="0.000000001"
              min="0.000000001"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={!connected || isSubmitting}
            />
          </div>
          
          {txHash && (
            <div className="mt-4 flex items-center justify-between p-3 bg-secondary rounded-md">
              <span className="text-xs font-mono truncate max-w-[180px]">Transaction: {txHash.substring(0, 8)}...{txHash.substring(txHash.length - 8)}</span>
              <Button variant="ghost" size="sm" onClick={viewTransaction}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!connected || isSubmitting || !recipient || !amount}
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Sending...' : 'Send SUI'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SuiTransactionForm;
