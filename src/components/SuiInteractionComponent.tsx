
import { useState } from 'react';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { NETWORKS } from '@/lib/sui-client';
import SuiNetworkSelector from '@/components/SuiNetworkSelector';
import SuiWalletConnect from '@/components/SuiWalletConnect';
import SuiTransactionForm from '@/components/SuiTransactionForm';

const SuiInteractionComponent = () => {
  const [network, setNetwork] = useState(NETWORKS.TESTNET);

  return (
    <section id="sui-interaction" className="py-20 px-4 bg-background">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Sui Blockchain Interaction</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect your wallet and interact with the Sui blockchain directly from this application.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <SuiNetworkSelector network={network} onNetworkChange={setNetwork} />
            
            <WalletProvider>
              <SuiWalletConnect network={network} />
            </WalletProvider>
          </div>
          
          <div>
            <WalletProvider>
              <SuiTransactionForm network={network} />
            </WalletProvider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuiInteractionComponent;
