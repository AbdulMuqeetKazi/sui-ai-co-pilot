
export interface Concept {
  id: string;
  title: string;
  description: string;
  docLink?: string;
  category: 'basics' | 'advanced' | 'development' | 'tools';
  keywords: string[];
}

export const concepts: Concept[] = [
  {
    id: 'move-language',
    title: 'Move Language',
    description: 'Move is a programming language for writing safe smart contracts originally developed at Facebook for the Libra blockchain. Sui Move is a dialect of the Move language adapted for the Sui blockchain.',
    docLink: 'https://docs.sui.io/build/move',
    category: 'basics',
    keywords: ['programming', 'language', 'smart contracts', 'development'],
  },
  {
    id: 'sui-objects',
    title: 'Sui Objects',
    description: 'In Sui, objects are the primary data unit. All data stored on the Sui blockchain is organized into objects, which can be owned by an address and transferred between addresses.',
    docLink: 'https://docs.sui.io/build/objects',
    category: 'basics',
    keywords: ['data', 'storage', 'ownership', 'state'],
  },
  {
    id: 'gas-fees',
    title: 'Gas Fees',
    description: 'Gas fees in Sui are the computational costs associated with processing transactions on the blockchain. They are paid in SUI tokens and vary based on the complexity of the transaction.',
    docLink: 'https://docs.sui.io/build/gas',
    category: 'basics',
    keywords: ['transaction', 'cost', 'tokens', 'payment'],
  },
  {
    id: 'sui-addresses',
    title: 'Sui Addresses',
    description: 'Sui addresses represent accounts on the Sui blockchain. They are derived from public keys and are used to identify the sender and recipient of transactions.',
    docLink: 'https://docs.sui.io/build/addresses',
    category: 'basics',
    keywords: ['accounts', 'identity', 'keys', 'transactions'],
  },
  {
    id: 'custom-types',
    title: 'Custom Types in Move',
    description: 'Move allows developers to define custom types like structs and resources. These types can be used to model complex data structures and enforce ownership rules.',
    docLink: 'https://docs.sui.io/build/move/structs-and-resources',
    category: 'development',
    keywords: ['types', 'structs', 'resources', 'development'],
  },
  {
    id: 'transaction-blocks',
    title: 'Transaction Blocks',
    description: 'Transaction blocks in Sui allow multiple operations to be executed atomically. This enables complex transactions that can modify multiple objects in a single operation.',
    docLink: 'https://docs.sui.io/build/transactions',
    category: 'advanced',
    keywords: ['transactions', 'atomic', 'operations', 'blocks'],
  },
  {
    id: 'object-capabilities',
    title: 'Object Capabilities',
    description: 'The capability model in Sui ensures that only entities with the appropriate permissions can access or modify objects, enhancing security and preventing unauthorized access.',
    docLink: 'https://docs.sui.io/build/programming-with-objects',
    category: 'advanced',
    keywords: ['security', 'permissions', 'access', 'capabilities'],
  },
  {
    id: 'sui-cli',
    title: 'Sui CLI Tools',
    description: 'Sui provides command-line tools for interacting with the blockchain, deploying contracts, and managing objects. These tools are essential for Sui development.',
    docLink: 'https://docs.sui.io/build/cli',
    category: 'tools',
    keywords: ['tools', 'command-line', 'development', 'deployment'],
  }
];
