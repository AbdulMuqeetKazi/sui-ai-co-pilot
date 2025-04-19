
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@suiet/wallet-kit';
import { Card } from '@/components/ui/card';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatInput from './chat/ChatInput';
import { useChatWithAI } from '@/hooks/useChatWithAI';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeHighlighter from './CodeHighlighter';

const ImprovedSuiAIChat = () => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    clearChat
  } = useChatWithAI();
  
  const { account, connected } = useWallet();
  const [selectedCodeSnippet, setSelectedCodeSnippet] = useState<string | null>(null);
  
  // Extract all code snippets from the conversation
  const allCodeSnippets = messages
    .filter(msg => msg.role === 'assistant' && msg.codeSnippets && msg.codeSnippets.length > 0)
    .flatMap(msg => msg.codeSnippets || []);
  
  // When new code snippets appear, select the latest one
  useEffect(() => {
    if (allCodeSnippets.length > 0 && !selectedCodeSnippet) {
      setSelectedCodeSnippet(allCodeSnippets[allCodeSnippets.length - 1]);
    }
  }, [allCodeSnippets, selectedCodeSnippet]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getWalletContext = () => {
    if (connected && account) {
      return `Connected wallet: ${account.address}\n`;
    }
    return 'Wallet not connected. Connect your wallet to get contextual help with your accounts.';
  };

  return (
    <div className="space-y-4">
      <Card className="flex flex-col w-full h-[600px] border shadow-md">
        <ChatHeader 
          onClearChat={clearChat} 
          subtitle={connected ? `Wallet connected: ${account?.address.slice(0, 6)}...${account?.address.slice(-4)}` : undefined}
        />
        <ChatMessages messages={messages} isLoading={isLoading} />
        <div className="border-t p-4">
          <ChatInput
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSendMessage={sendMessage}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Sui development, blockchain concepts, or get help with your wallet..."
          />
        </div>
      </Card>
      
      {allCodeSnippets.length > 0 && (
        <Card className="border shadow-sm">
          <Tabs defaultValue="latest" className="w-full p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Generated Code Snippets</h3>
              <TabsList>
                <TabsTrigger value="latest">Latest</TabsTrigger>
                <TabsTrigger value="all">All ({allCodeSnippets.length})</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="latest" className="mt-0">
              <CodeHighlighter 
                code={allCodeSnippets[allCodeSnippets.length - 1]} 
                language="move"
                showLineNumbers
              />
            </TabsContent>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allCodeSnippets.map((snippet, index) => (
                  <CodeHighlighter
                    key={index}
                    code={snippet}
                    language="move"
                    title={`Snippet ${index + 1}`}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default ImprovedSuiAIChat;
