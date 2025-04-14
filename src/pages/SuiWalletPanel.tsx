
import { useState } from 'react';
import { WalletProvider } from '@suiet/wallet-kit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SuiWalletConnect from '@/components/SuiWalletConnect';
import SuiTransactionForm from '@/components/SuiTransactionForm';
import SuiNetworkSelector from '@/components/SuiNetworkSelector';
import { NETWORKS } from '@/lib/sui-client';

const SuiWalletPanel = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>(NETWORKS.TESTNET);

  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 gradient-text">Sui Wallet Integration</h1>
      <p className="text-muted-foreground mb-6">
        Connect your Sui wallet, check your balance, and make transactions
      </p>

      <WalletProvider>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Network Settings</CardTitle>
                <CardDescription>Select which Sui network to connect to</CardDescription>
              </CardHeader>
              <CardContent>
                <SuiNetworkSelector 
                  selectedNetwork={selectedNetwork} 
                  onNetworkChange={handleNetworkChange} 
                />
              </CardContent>
            </Card>
            
            <SuiWalletConnect network={selectedNetwork} />
          </div>
          
          <SuiTransactionForm network={selectedNetwork} />
        </div>
      </WalletProvider>
    </div>
  );
};

export default SuiWalletPanel;
