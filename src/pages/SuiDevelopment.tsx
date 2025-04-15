
import { useState } from 'react';
import { WalletProvider } from '@suiet/wallet-kit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import SuiWalletConnect from '@/components/SuiWalletConnect';
import SuiAIChat from '@/components/SuiAIChat';
import CodeSnippetGenerator from '@/components/CodeSnippetGenerator';
import ConceptExplainer from '@/components/ConceptExplainer';
import TransactionSimulator from '@/components/TransactionSimulator';
import GenAITestPanel from '@/components/GenAITestPanel';
import { NETWORKS } from '@/lib/sui-client';

const SuiDevelopment = () => {
  const [network, setNetwork] = useState(NETWORKS.TESTNET);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Sui Developer Suite</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            A full-stack developer assistant for blockchain projects on the Sui network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <WalletProvider>
            <div className="md:col-span-1">
              <SuiWalletConnect network={network} />
            </div>
          </WalletProvider>
          
          <div className="md:col-span-3">
            <Tabs defaultValue="chat">
              <TabsList className="grid grid-cols-5 max-w-3xl mb-8">
                <TabsTrigger value="chat">AI Chat</TabsTrigger>
                <TabsTrigger value="code">Code Generator</TabsTrigger>
                <TabsTrigger value="concepts">Concept Explorer</TabsTrigger>
                <TabsTrigger value="transactions">Transaction Simulator</TabsTrigger>
                <TabsTrigger value="debug">AI Debug</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="mt-0">
                <WalletProvider>
                  <SuiAIChat />
                </WalletProvider>
              </TabsContent>
              
              <TabsContent value="code" className="mt-0">
                <CodeSnippetGenerator />
              </TabsContent>
              
              <TabsContent value="concepts" className="mt-0">
                <ConceptExplainer />
              </TabsContent>
              
              <TabsContent value="transactions" className="mt-0">
                <WalletProvider>
                  <TransactionSimulator network={network} />
                </WalletProvider>
              </TabsContent>
              
              <TabsContent value="debug" className="mt-0">
                <GenAITestPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuiDevelopment;
