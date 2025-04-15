
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@suiet/wallet-kit';
import { toast } from '@/hooks/use-toast';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatInput from './chat/ChatInput';
import { Message } from './chat/types';
import { Card } from './ui/card';

const SuiAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { account, connected } = useWallet();

  // Load previous conversation from Supabase
  useEffect(() => {
    if (user) {
      const loadConversation = async () => {
        const { data, error } = await supabase
          .from('prompt_history')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'ai_chat')
          .order('created_at', { ascending: true })
          .limit(50);

        if (error) {
          console.error('Error loading conversation:', error);
          return;
        }

        if (data && data.length > 0) {
          const loadedMessages = data.flatMap((item): Message[] => {
            const messages: Message[] = [];
            
            // Add user message
            messages.push({
              id: parseInt(item.id.slice(0, 8), 16),
              role: 'user',
              content: item.prompt
            });
            
            // Add assistant response
            messages.push({
              id: parseInt(item.id.slice(0, 8), 16) + 1,
              role: 'assistant',
              content: item.response,
              codeSnippets: extractCodeSnippets(item.response)
            });
            
            return messages;
          });
          
          setMessages(loadedMessages);
        }
      };

      loadConversation();
    }
  }, [user]);

  // Extract code snippets from text
  const extractCodeSnippets = (text: string): string[] => {
    const codeRegex = /```[\w]*\n([\s\S]*?)```/g;
    const snippets: string[] = [];
    let match;
    
    while ((match = codeRegex.exec(text)) !== null) {
      snippets.push(match[1].trim());
    }
    
    return snippets;
  };

  // Send a message to the AI
  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || !user) return;
    
    const newUserMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare context with wallet information if connected
      const context: Record<string, any> = { 
        userId: user.id
      };
      
      if (connected && account) {
        context.walletAddress = account.address;
        
        // Try to fetch wallet info
        try {
          const walletInfo = await supabase.functions.invoke('getWalletInfo', {
            body: JSON.stringify({ 
              walletAddress: account.address,
              network: 'testnet' // Default to testnet
            })
          });
          
          if (!walletInfo.error) {
            context.walletInfo = walletInfo.data;
          }
        } catch (error) {
          console.error('Failed to fetch wallet info:', error);
        }
      }

      // Call the AI function
      const { data, error } = await supabase.functions.invoke('askAI', {
        body: JSON.stringify({ 
          prompt: input,
          context
        })
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        codeSnippets: extractCodeSnippets(data.response)
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Log prompt history
      await supabase
        .from('prompt_history')
        .insert({
          user_id: user.id,
          prompt: input,
          response: data.response,
          type: 'ai_chat',
          tokens_used: data.tokens || 0
        });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, user, connected, account]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <Card className="flex flex-col w-full h-[600px] border shadow-md">
      <ChatHeader onClearChat={handleClearChat} />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <div className="border-t p-4">
        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSendMessage={handleSendMessage}
          onKeyDown={handleKeyDown}
        />
      </div>
    </Card>
  );
};

export default SuiAIChat;
