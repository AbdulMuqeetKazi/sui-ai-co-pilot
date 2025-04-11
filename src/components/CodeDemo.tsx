
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CodeDemo = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Code copied",
      description: "The code snippet has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const movePackageExample = `module sui_demo::nft_marketplace {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;

    struct Listing has key, store {
        id: UID,
        price: u64,
        owner: address,
        nft_id: ID,
    }

    struct ListingCreated has copy, drop {
        listing_id: ID,
        nft_id: ID,
        price: u64,
        owner: address,
    }

    public fun create_listing(
        nft_id: ID, 
        price: u64, 
        ctx: &mut TxContext
    ) {
        let owner = tx_context::sender(ctx);
        
        let listing = Listing {
            id: object::new(ctx),
            price,
            owner,
            nft_id,
        };
        
        event::emit(ListingCreated {
            listing_id: object::id(&listing),
            nft_id,
            price,
            owner,
        });
        
        transfer::share_object(listing);
    }
}`;

  const suiTypesExample = `// Various Sui types and their usage
struct Balance<phantom T> has store { /* ... */ }
struct Coin<phantom T> has key, store { /* ... */ }
struct TransferRequest<phantom T> has key { /* ... */ }

// Working with Objects and IDs in Sui
let object_id = object::id(&some_object);

// Using Sui's Option Type
let maybe_value: Option<u64> = option::some(100);
if (option::is_some(&maybe_value)) {
    let value = option::extract(&mut maybe_value);
    // use value...
};

// Table data structure
let my_table = table::new<address, u64>(ctx);
table::add(&mut my_table, @sender, 100);
let value = table::borrow(&my_table, @sender);
table::remove(&mut my_table, @sender);`;

  const useAIPromptExample = `// Ask SuiCoPilot AI:
"Create a module for a basic DAO voting system on Sui with 
the following features:
- Token-based voting
- Proposal creation and execution
- Vote delegation
- Time-limited proposals"

// AI will generate a complete implementation with proper
// Sui patterns and best practices`;

  return (
    <section id="examples" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Code Examples</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how SuiCoPilot helps you write better Sui Move code faster with AI assistance.
          </p>
        </div>
        
        <div className="bg-card border rounded-xl shadow-lg overflow-hidden">
          <Tabs defaultValue="move-package">
            <div className="border-b px-4">
              <TabsList className="h-12">
                <TabsTrigger value="move-package">NFT Marketplace</TabsTrigger>
                <TabsTrigger value="sui-types">Sui Types</TabsTrigger>
                <TabsTrigger value="ai-prompt">AI Prompt</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 z-10"
                onClick={() => copyToClipboard(movePackageExample)}
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              
              <TabsContent value="move-package" className="code-block m-0 rounded-t-none">
                <pre>{movePackageExample}</pre>
              </TabsContent>
              
              <TabsContent value="sui-types" className="code-block m-0 rounded-t-none">
                <pre>{suiTypesExample}</pre>
              </TabsContent>
              
              <TabsContent value="ai-prompt" className="code-block m-0 rounded-t-none">
                <pre>{useAIPromptExample}</pre>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default CodeDemo;
