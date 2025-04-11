
// This is a mock service that simulates AI responses
// In a real implementation, this would connect to an AI service or API

type AiResponse = {
  content: string;
  codeSnippets?: string[];
  references?: {
    title: string;
    url: string;
  }[];
};

export async function generateAiResponse(prompt: string): Promise<AiResponse> {
  console.log("AI Service received prompt:", prompt);
  
  // In a real implementation, this would call an API
  // For the demo, we'll return mock responses based on keywords in the prompt
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  if (prompt.toLowerCase().includes("nft")) {
    return {
      content: "Here's how you can create a basic NFT on Sui Move:",
      codeSnippets: [
        `module my_nft::basic_nft {
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
}`
      ],
      references: [
        {
          title: "Sui NFT Documentation",
          url: "https://docs.sui.io/build/programming-with-objects/nft"
        }
      ]
    };
  }
  
  if (prompt.toLowerCase().includes("smart contract") || prompt.toLowerCase().includes("contract")) {
    return {
      content: "Here's a template for a basic Sui Move smart contract:",
      codeSnippets: [
        `module example::basic_contract {
  use sui::object::{Self, UID};
  use sui::transfer;
  use sui::tx_context::{Self, TxContext};
  
  // Define your custom struct with the key ability
  struct ExampleObject has key, store {
      id: UID,
      value: u64,
      owner: address
  }
  
  // Initialize a new object
  public fun create(value: u64, ctx: &mut TxContext): ExampleObject {
      ExampleObject {
          id: object::new(ctx),
          value,
          owner: tx_context::sender(ctx)
      }
  }
  
  // Public entry function to create and transfer an object
  public entry fun create_and_transfer(value: u64, ctx: &mut TxContext) {
      let object = create(value, ctx);
      transfer::transfer(object, tx_context::sender(ctx));
  }
  
  // Function to update the value
  public entry fun update_value(object: &mut ExampleObject, new_value: u64, ctx: &TxContext) {
      assert!(object.owner == tx_context::sender(ctx), 0);
      object.value = new_value;
  }
}`
      ],
      references: [
        {
          title: "Sui Move Programming Basics",
          url: "https://docs.sui.io/build/move"
        }
      ]
    };
  }
  
  // Default response
  return {
    content: "I can help you with Sui blockchain development. Try asking about specific topics like NFTs, coins, smart contracts, or specific Move programming patterns.",
    references: [
      {
        title: "Sui Developer Documentation",
        url: "https://docs.sui.io/"
      }
    ]
  };
}
