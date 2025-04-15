
import { useState } from 'react';
import { WalletProvider } from '@suiet/wallet-kit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SuiWalletConnect from '@/components/SuiWalletConnect';
import SuiAIChat from '@/components/SuiAIChat';
import CodeSnippetGenerator from '@/components/CodeSnippetGenerator';
import ConceptExplainer from '@/components/ConceptExplainer';
import Navbar from '@/components/Navbar';
import { NETWORKS } from '@/lib/sui-client';

const SuiDeveloperAssistant = () => {
  const [network, setNetwork] = useState(NETWORKS.TESTNET);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Sui Developer Assistant</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your AI-powered companion for Sui blockchain development
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <WalletProvider>
            <div className="md:col-span-1">
              <SuiWalletConnect network={network} />
            </div>
          </WalletProvider>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Connect your wallet and explore the tools below to accelerate your Sui development
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                This developer assistant provides several tools to help you build on Sui:
              </p>
              <ul>
                <li><strong>AI Chat:</strong> Ask questions about Sui development</li>
                <li><strong>Code Generator:</strong> Create Move code snippets from natural language</li>
                <li><strong>Concept Explainer:</strong> Learn about Sui blockchain concepts</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
            <TabsTrigger value="code">Code Generator</TabsTrigger>
            <TabsTrigger value="concepts">Concept Explainer</TabsTrigger>
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
        </Tabs>
      </main>
    </div>
  );
};

export default SuiDeveloperAssistant;
