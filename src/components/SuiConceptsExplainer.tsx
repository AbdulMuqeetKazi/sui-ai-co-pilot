
import React, { useState } from 'react';
import { 
  Book, 
  ChevronDown, 
  ExternalLink,
  Search,
  BookOpen,
  ChevronRight,
  HelpCircle,
  Database,
  Lock,
  Shield,
  Layers,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Define types for concepts data
type ConceptLink = {
  title: string;
  url: string;
}

type SuiConcept = {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  details: string[];
  links: ConceptLink[];
}

// Data for Sui concepts
const suiConcepts: SuiConcept[] = [
  {
    id: "objects",
    title: "Sui Objects",
    icon: Database,
    description: "Digital assets represented as objects in Sui.",
    details: [
      "Every asset in Sui is an object, uniquely identified by a 32-byte ID.",
      "Objects are owned and can be transferred between addresses.",
      "Objects can be stored on-chain and referenced by transactions.",
      "Sui's object-centric model differs from account-based blockchains."
    ],
    links: [
      { title: "Programming with Objects", url: "https://docs.sui.io/build/programming-with-objects" },
      { title: "Object Basics", url: "https://docs.sui.io/learn/objects" }
    ]
  },
  {
    id: "move",
    title: "Move Programming",
    icon: Code,
    description: "The smart contract language used on Sui.",
    details: [
      "Move is a secure programming language for implementing custom logic and smart contracts.",
      "It was created at Facebook/Meta and adopted by Sui.",
      "Move uses a resource-oriented approach with strong ownership rules.",
      "It prioritizes safety and prevents issues like double-spending by design."
    ],
    links: [
      { title: "Move Language", url: "https://docs.sui.io/build/move" },
      { title: "Move Tutorial", url: "https://docs.sui.io/build/move/learn-move" }
    ]
  },
  {
    id: "transactions",
    title: "Sui Transactions",
    icon: Layers,
    description: "How operations are processed on the Sui blockchain.",
    details: [
      "Sui offers both programmable transactions and simple transfers.",
      "Transaction throughput can scale horizontally with the number of validators.",
      "Sui utilizes parallel execution for non-conflicting transactions.",
      "Different types include Transfer, Pay, Publish, and Call."
    ],
    links: [
      { title: "Transactions", url: "https://docs.sui.io/learn/transactions" },
      { title: "Transaction Lifecycle", url: "https://docs.sui.io/learn/architecture/txn-lifecycle" }
    ]
  },
  {
    id: "consensus",
    title: "Consensus",
    icon: Shield,
    description: "How Sui reaches agreement on transaction execution.",
    details: [
      "Sui uses a DAG-based consensus for simple transactions.",
      "Narwhal and Bullshark are used for more complex shared transactions.",
      "The consensus mechanism enables high throughput and low latency.",
      "Validators take turns to propose blocks in a Byzantine Fault Tolerant system."
    ],
    links: [
      { title: "Consensus", url: "https://docs.sui.io/learn/architecture/consensus" },
      { title: "Sui Architecture", url: "https://docs.sui.io/learn/architecture" }
    ]
  },
  {
    id: "security",
    title: "Security Model",
    icon: Lock,
    description: "How Sui protects assets and ensures network integrity.",
    details: [
      "Sui utilizes cryptographic primitives including signatures and hashing.",
      "Move's type system ensures memory safety and resource control.",
      "Assets are protected by ownership rules enforced by the runtime.",
      "The validator committee provides Byzantine fault tolerance."
    ],
    links: [
      { title: "Security", url: "https://docs.sui.io/learn/architecture/security" },
      { title: "Cryptography", url: "https://docs.sui.io/learn/cryptography" }
    ]
  }
];

// Main documentation links
const documentationLinks = [
  { 
    category: "Getting Started", 
    links: [
      { title: "Sui Overview", url: "https://docs.sui.io/learn" },
      { title: "Installation", url: "https://docs.sui.io/build/install" },
      { title: "First Dapp", url: "https://docs.sui.io/build/first-app" }
    ]
  },
  { 
    category: "Development", 
    links: [
      { title: "Move Programming", url: "https://docs.sui.io/build/move" },
      { title: "Smart Contracts", url: "https://docs.sui.io/build/smart-contracts" },
      { title: "Writing Objects", url: "https://docs.sui.io/build/programming-with-objects" }
    ]
  },
  { 
    category: "Tools & SDKs", 
    links: [
      { title: "TypeScript SDK", url: "https://docs.sui.io/build/typescript-sdk" },
      { title: "Rust SDK", url: "https://docs.sui.io/build/rust-sdk" },
      { title: "CLI Reference", url: "https://docs.sui.io/build/cli-client" }
    ]
  },
  { 
    category: "Advanced Topics", 
    links: [
      { title: "Architecture", url: "https://docs.sui.io/learn/architecture" },
      { title: "Economics", url: "https://docs.sui.io/learn/tokenomics" },
      { title: "Cryptography", url: "https://docs.sui.io/learn/cryptography" }
    ]
  }
];

const SuiConceptsExplainer = () => {
  const [isConceptsOpen, setIsConceptsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcept, setSelectedConcept] = useState<SuiConcept | null>(null);

  // Filter concepts based on search query
  const filteredConcepts = suiConcepts.filter(
    concept => 
      concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="sui-concepts" className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Sui Blockchain</span> Concepts
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Understand the core concepts behind Sui blockchain and access comprehensive documentation 
            to accelerate your development journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <Collapsible 
              open={isConceptsOpen} 
              onOpenChange={setIsConceptsOpen}
              className="border rounded-lg"
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-sui-600" />
                    <h3 className="font-medium">Core Concepts</h3>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isConceptsOpen ? 'transform rotate-180' : ''}`} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-2">
                  {filteredConcepts.length > 0 ? (
                    filteredConcepts.map((concept) => (
                      <div 
                        key={concept.id}
                        onClick={() => setSelectedConcept(concept)}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${selectedConcept?.id === concept.id ? 'bg-sui-100 text-sui-800' : 'hover:bg-muted'}`}
                      >
                        <concept.icon className="h-5 w-5 text-sui-600" />
                        <div>
                          <h4 className="font-medium">{concept.title}</h4>
                          <p className="text-xs text-muted-foreground">{concept.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-center text-muted-foreground">
                      No concepts match your search
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-md flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-sui-600" />
                  Documentation
                </CardTitle>
                <CardDescription>
                  Access official Sui documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {documentationLinks.map((section, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-sm">{section.category}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {section.links.map((link, linkIndex) => (
                            <li key={linkIndex}>
                              <a 
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <ChevronRight className="h-3 w-3" />
                                {link.title}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedConcept ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-sui-100 flex items-center justify-center">
                      <selectedConcept.icon className="h-5 w-5 text-sui-700" />
                    </div>
                    <div>
                      <CardTitle>{selectedConcept.title}</CardTitle>
                      <CardDescription>{selectedConcept.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {selectedConcept.details.map((detail, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="w-5 h-5 rounded-full bg-sui-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-sui-700">{index + 1}</span>
                        </div>
                        <p>{detail}</p>
                      </div>
                    ))}
                  </div>
                  
                  {selectedConcept.links.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Book className="h-4 w-4" />
                        Learn More
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedConcept.links.map((link, index) => (
                          <Button key={index} variant="outline" size="sm" asChild>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              {link.title}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8 max-w-lg">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-medium mb-2">Select a Concept</h3>
                  <p className="text-muted-foreground mb-4">
                    Click on any concept from the list to view detailed information and learning resources.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedConcept(suiConcepts[0])}
                  >
                    Start with Sui Objects
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <a href="https://docs.sui.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>Explore Full Documentation</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SuiConceptsExplainer;
