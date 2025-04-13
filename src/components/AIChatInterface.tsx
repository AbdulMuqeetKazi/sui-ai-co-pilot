
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { generateAiResponse } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';
import { Message } from '@/components/chat/types';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';

const AIChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      role: 'user', 
      content: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call the AI service
      const response = await generateAiResponse(input);
      
      // Add AI response
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.content,
        codeSnippets: response.codeSnippets,
        references: response.references
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "All messages have been cleared.",
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section id="chat" className="py-20 px-4 bg-secondary/50">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Ask SuiCoPilot</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get real-time help with your Sui blockchain development questions.
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto border shadow-lg">
          <CardContent className="p-0 flex flex-col h-[550px]">
            <ChatHeader onClearChat={handleClearChat} />
            
            <ChatMessages 
              messages={messages} 
              isLoading={isLoading} 
            />
            
            <Separator />
            
            <div className="p-4">
              <ChatInput
                input={input}
                isLoading={isLoading}
                onInputChange={setInput}
                onSendMessage={handleSendMessage}
                onKeyDown={handleKeyDown}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AIChatInterface;
