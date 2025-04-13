
import { useState, useEffect } from 'react';
import { WalletProvider, useWallet, ConnectButton } from '@suiet/wallet-kit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react';
import { formatBalance, getExplorerUrl } from '@/lib/sui-client';
import { toast } from '@/hooks/use-toast';

interface WalletInfoProps {
  network: string;
}

const WalletInfo = ({ network }: WalletInfoProps) => {
  const { connected, account, disconnect } = useWallet();

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      toast({
        title: 'Address copied',
        description: 'Your wallet address has been copied to clipboard.',
      });
    }
  };

  const viewInExplorer = () => {
    if (account?.address) {
      const url = getExplorerUrl(network, 'address', account.address);
      window.open(url, '_blank');
    }
  };

  if (!connected || !account) {
    return (
      <div className="flex justify-center p-4">
        <ConnectButton>
          <Button className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </ConnectButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Connected Wallet</div>
          <Button variant="ghost" size="sm" onClick={disconnect}>
            <LogOut className="h-4 w-4 mr-1" />
            Disconnect
          </Button>
        </div>
        
        <div className="p-3 bg-secondary rounded-md">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs truncate max-w-[180px]">
              {account.address}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={viewInExplorer}>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        <div className="text-sm font-medium">Balance</div>
        <div className="text-lg font-semibold">
          {account.balance ? formatBalance(account.balance) : '0 SUI'}
        </div>
      </div>
    </div>
  );
};

const SuiWalletConnect = ({ network }: WalletInfoProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Wallet</CardTitle>
        <CardDescription>Connect your Sui wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <WalletInfo network={network} />
      </CardContent>
    </Card>
  );
};

export default SuiWalletConnect;
