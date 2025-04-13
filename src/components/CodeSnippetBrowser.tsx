
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2, Code as CodeIcon, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { codeSnippets } from '@/lib/code-snippets';
import { toast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Define types for our code snippets
type CodeSnippet = {
  id: string;
  title: string;
  description: string;
  code: string;
  category: 'basic' | 'coin' | 'events' | 'nft' | 'storage' | 'advanced';
  tags: string[];
};

const CodeSnippetBrowser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Expanded code snippets collection based on the imported codeSnippets
  const allSnippets: CodeSnippet[] = [
    {
      id: 'basic-module',
      title: 'Basic Sui Module',
      description: 'A simple Sui Move module with basic structure',
      code: codeSnippets.basicModule,
      category: 'basic',
      tags: ['module', 'beginner', 'structure']
    },
    {
      id: 'coin-module',
      title: 'Custom Coin Implementation',
      description: 'Create a custom fungible token on Sui',
      code: codeSnippets.coin,
      category: 'coin',
      tags: ['coin', 'token', 'fungible']
    },
    {
      id: 'events-module',
      title: 'Events Implementation',
      description: 'Emit and handle events in Sui Move',
      code: codeSnippets.events,
      category: 'events',
      tags: ['events', 'emit', 'notifications']
    },
    {
      id: 'nft-basic',
      title: 'Basic NFT Implementation',
      description: 'Create a simple non-fungible token on Sui',
      code: `module example::basic_nft {
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
}`,
      category: 'nft',
      tags: ['nft', 'token', 'non-fungible']
    },
    {
      id: 'storage-module',
      title: 'Object Storage Pattern',
      description: 'Patterns for storing and retrieving objects on Sui',
      code: `module example::storage {
    use sui::object::{Self, UID};
    use sui::dynamic_field;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    struct Storage has key {
        id: UID,
        owner: address,
        item_count: u64
    }
    
    struct Item has store {
        name: std::string::String,
        value: u64
    }
    
    public entry fun create_storage(ctx: &mut TxContext) {
        let storage = Storage {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            item_count: 0
        };
        transfer::transfer(storage, tx_context::sender(ctx));
    }
    
    public entry fun add_item(
        storage: &mut Storage, 
        name: vector<u8>, 
        value: u64, 
        ctx: &mut TxContext
    ) {
        let item = Item {
            name: std::string::utf8(name),
            value
        };
        
        // Use item count as the key
        dynamic_field::add(&mut storage.id, storage.item_count, item);
        storage.item_count = storage.item_count + 1;
    }
    
    public fun get_item(storage: &Storage, idx: u64): &Item {
        dynamic_field::borrow(&storage.id, idx)
    }
}`,
      category: 'storage',
      tags: ['storage', 'dynamic fields', 'objects']
    }
  ];

  // Filter snippets based on search query and category
  const filteredSnippets = allSnippets.filter(snippet => {
    const matchesSearch = searchQuery === '' || 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || snippet.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast({
      title: "Copied",
      description: "Code snippet copied to clipboard",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="code-snippets" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Sui Code Snippets</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse and copy ready-to-use Sui Move code snippets for common patterns and functionalities.
          </p>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search snippets by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="coin">Coins</TabsTrigger>
                <TabsTrigger value="nft">NFTs</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredSnippets.length > 0 ? (
                filteredSnippets.map((snippet) => (
                  <Collapsible key={snippet.id} className="border rounded-lg overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <div className="bg-sui-100 text-sui-800 p-2 rounded-md">
                            <CodeIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{snippet.title}</h3>
                            <p className="text-sm text-muted-foreground">{snippet.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {snippet.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-secondary text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="relative">
                        <pre className="bg-muted p-4 overflow-x-auto text-sm">{snippet.code}</pre>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(snippet.code, snippet.id)}
                        >
                          {copiedId === snippet.id ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <CodeIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No matching snippets found. Try adjusting your search.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </section>
  );
};

export default CodeSnippetBrowser;
