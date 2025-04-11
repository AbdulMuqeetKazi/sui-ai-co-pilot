
export const codeSnippets = {
  basicModule: `module example::basic {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    struct Example has key, store {
        id: UID,
        value: u64,
    }
    
    public entry fun create(value: u64, ctx: &mut TxContext) {
        let example = Example {
            id: object::new(ctx),
            value,
        };
        transfer::transfer(example, tx_context::sender(ctx));
    }
}`,
  
  coin: `module mycoin::managed {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    /// Name of the coin
    struct MYCOIN has drop {}
    
    /// Create a new currency
    fun init(witness: MYCOIN, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            witness, 
            9, // decimals
            b"MYCOIN", 
            b"My Example Coin", 
            b"An example coin for the Sui blockchain", 
            option::none(), 
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx));
    }
    
    /// Mint new coins
    public entry fun mint(
        treasury_cap: &mut TreasuryCap<MYCOIN>, 
        amount: u64, 
        recipient: address, 
        ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, amount, recipient, ctx);
    }
}`,
  
  events: `module example::events {
    use sui::event;
    
    struct ItemCreated has copy, drop {
        id: ID,
        creator: address,
    }
    
    struct ItemSold has copy, drop {
        id: ID,
        price: u64,
        seller: address,
        buyer: address,
    }
    
    public fun emit_created_event(id: ID, creator: address) {
        event::emit(ItemCreated { id, creator });
    }
    
    public fun emit_sold_event(id: ID, price: u64, seller: address, buyer: address) {
        event::emit(ItemSold { id, price, seller, buyer });
    }
}`
};
