
import React, { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Code, Copy } from 'lucide-react';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  codeSnippets?: string[];
};

const AIChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const extractCodeSnippets = (text: string): string[] => {
    const codeRegex = /```[\w]*\n([\s\S]*?)```/g;
    const snippets: string[] = [];
    let match;
    
    while ((match = codeRegex.exec(text)) !== null) {
      snippets.push(match[1].trim());
    }
    
    return snippets;
  };

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
      const { data, error } = await supabase.functions.invoke('askAI', {
        body: JSON.stringify({ 
          prompt: input,
          context: {
            userId: user.id,
            walletAddress: user.email // Replace with actual wallet address when available
          }
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
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [input, user]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied',
      description: 'Code snippet copied to clipboard'
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code /> Sui AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary'
              }`}
            >
              {message.content}
              {message.codeSnippets && message.codeSnippets.map((snippet, index) => (
                <div 
                  key={index} 
                  className="mt-2 bg-background border rounded-md p-2 relative"
                >
                  <pre className="text-sm overflow-x-auto">{snippet}</pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1 right-1"
                    onClick={() => handleCopyCode(snippet)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Sui development..."
            disabled={isLoading || !user}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !input.trim() || !user}
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatInterface;
