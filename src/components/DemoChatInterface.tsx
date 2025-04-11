
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SendHorizontal, Bot, User, Sparkles } from 'lucide-react';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

const predefinedMessages: Message[] = [
  {
    id: 1,
    role: 'user',
    content: 'How do I create a simple NFT contract on Sui?'
  },
  {
    id: 2,
    role: 'assistant',
    content: `Here's a basic NFT module for Sui Move:

\`\`\`
module my_nft::basic_nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use sui::url::{Self, Url};

    struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        creator: address
    }

    public entry fun mint_nft(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let nft = NFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            creator: tx_context::sender(ctx)
        };
        
        transfer::transfer(nft, tx_context::sender(ctx))
    }
}
\`\`\`

This creates a basic NFT with a name, description, URL for the asset, and tracks the creator. To mint it, call the \`mint_nft\` function.`
  },
  {
    id: 3,
    role: 'user',
    content: 'How would I implement a transfer function for this NFT?'
  }
];

const DemoChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(predefinedMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessage: Message = {
      id: messages.length + 1,
      role: 'user', 
      content: input,
    };
    
    setMessages([...messages, newMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: `To implement a transfer function for your NFT, add the following to your module:

\`\`\`
public entry fun transfer_nft(
    nft: NFT,
    recipient: address,
    _ctx: &mut TxContext
) {
    transfer::transfer(nft, recipient)
}
\`\`\`

This function takes an NFT object, a recipient address, and transfers ownership. 

Since Sui objects are move-by-value by default with the \`store\` ability, users who own an NFT can directly call this function to transfer it to someone else.

You could also implement additional checks in this function, like verifying that only certain addresses can receive the NFT, or implementing a marketplace with payment logic.`
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section id="capabilities" className="py-20 px-4 bg-secondary/50">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Interactive Assistant</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience how the SuiCoPilot chat interface helps you solve development challenges.
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto border shadow-lg">
          <CardContent className="p-0">
            <div className="bg-sui-900 text-white py-3 px-4 flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-medium">SuiCoPilot Chat</h3>
              <div className="flex items-center gap-1 bg-sui-700 px-2 py-0.5 rounded-full text-xs ml-2">
                <Sparkles className="h-3 w-3" />
                <span>AI Powered</span>
              </div>
            </div>
            
            <div className="h-[400px] overflow-y-auto p-4 flex flex-col gap-4">
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
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 mr-8">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sui-100 text-sui-800 flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="p-3 rounded-lg bg-card border">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-sui-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-sui-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-sui-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question about Sui development..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DemoChatInterface;
