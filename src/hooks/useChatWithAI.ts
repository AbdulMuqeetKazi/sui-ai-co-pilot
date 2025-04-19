
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@suiet/wallet-kit';
import { Message } from '@/components/chat/types';
import { toast } from '@/hooks/use-toast';

export const useChatWithAI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { account, connected } = useWallet();

  // Load conversation history from Supabase
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
  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input;
    if (!messageToSend.trim() || !user) return;
    
    const newUserMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: messageToSend
    };

    setMessages(prev => [...prev, newUserMessage]);
    
    if (!messageText) {
      setInput('');
    }
    
    setIsLoading(true);

    try {
      // Prepare context with conversation history for context
      const conversationHistory = messages.slice(-6); // Last 6 messages for context
      
      // Prepare context with wallet information if connected
      const context: Record<string, any> = { 
        userId: user.id,
        conversationHistory: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
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
          prompt: messageToSend,
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
          prompt: messageToSend,
          response: data.response,
          type: 'ai_chat',
          tokens_used: data.tokens?.total_tokens || data.stats?.total_tokens || 0
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
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    clearChat
  };
};
