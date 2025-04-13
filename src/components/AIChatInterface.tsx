
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizontal, Bot, User, Sparkles, XCircle, Loader2 } from 'lucide-react';
import { generateAiResponse } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  codeSnippets?: string[];
  references?: {
    title: string;
    url: string;
  }[];
};

const AIChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

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
            <div className="bg-sui-900 text-white py-3 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <h3 className="font-medium">SuiCoPilot Chat</h3>
                <div className="flex items-center gap-1 bg-sui-700 px-2 py-0.5 rounded-full text-xs ml-2">
                  <Sparkles className="h-3 w-3" />
                  <span>AI Powered</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearChat}
                className="text-white hover:text-white/80 hover:bg-sui-800"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
            
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Bot className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-center max-w-md">
                    Ask me about Sui development, Move programming, or blockchain concepts.
                    I can help with code snippets, explanations, and best practices.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'assistant' ? 'mr-8' : 'ml-8'}`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
                        ${message.role === 'assistant' ? 'bg-sui-100 text-sui-800' : 'bg-gray-200'}`}
                      >
                        {message.role === 'assistant' ? (
                          <Bot className="h-5 w-5" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      
                      <div className={`p-3 rounded-lg ${
                        message.role === 'assistant' 
                          ? 'bg-card border' 
                          : 'bg-primary text-primary-foreground'
                      }`}
                      >
                        <div className="whitespace-pre-wrap prose prose-sm max-w-none">
                          {message.content}
                        </div>
                        
                        {message.codeSnippets && message.codeSnippets.map((snippet, index) => (
                          <div key={index} className="mt-2 bg-muted rounded-md p-2 overflow-x-auto">
                            <pre className="text-sm">{snippet}</pre>
                          </div>
                        ))}
                        
                        {message.references && message.references.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-border/50">
                            <p className="text-xs text-muted-foreground mb-1">References:</p>
                            <ul className="list-disc list-inside text-xs space-y-1">
                              {message.references.map((ref, index) => (
                                <li key={index}>
                                  <a
                                    href={ref.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {ref.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3 mr-8">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sui-100 text-sui-800 flex items-center justify-center">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="p-3 rounded-lg bg-card border">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-sui-500" />
                          <span className="text-sm text-muted-foreground">Generating response...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
            
            <Separator />
            
            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about Sui development, Move code, or blockchain concepts..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  size="icon" 
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AIChatInterface;
