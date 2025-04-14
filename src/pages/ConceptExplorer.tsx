
import { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { concepts, Concept } from '@/lib/concepts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categoryLabels = {
  basics: 'Basic Concepts',
  advanced: 'Advanced Topics',
  development: 'Development',
  tools: 'Tools & Resources',
};

const ConceptExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter concepts based on search query
  const filteredConcepts = concepts.filter((concept) => {
    const query = searchQuery.toLowerCase();
    return (
      concept.title.toLowerCase().includes(query) ||
      concept.description.toLowerCase().includes(query) ||
      concept.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    );
  });

  // Group concepts by category
  const groupedConcepts: Record<string, Concept[]> = {
    basics: [],
    advanced: [],
    development: [],
    tools: [],
  };
  
  filteredConcepts.forEach((concept) => {
    groupedConcepts[concept.category].push(concept);
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 gradient-text">Sui Concept Explorer</h1>
      <p className="text-muted-foreground mb-6">
        Discover and understand key concepts of the Sui blockchain ecosystem
      </p>

      <div className="flex items-center relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Search concepts by title, description, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredConcepts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No concepts found matching your search.</p>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Concepts</TabsTrigger>
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Accordion type="single" collapsible className="space-y-4">
              {Object.entries(groupedConcepts).map(([category, items]) => (
                items.length > 0 && (
                  <div key={category} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">{categoryLabels[category as keyof typeof categoryLabels]}</h2>
                    <div className="space-y-4">
                      {items.map((concept) => (
                        <ConceptCard key={concept.id} concept={concept} />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </Accordion>
          </TabsContent>

          {Object.keys(groupedConcepts).map((category) => (
            <TabsContent key={category} value={category}>
              {groupedConcepts[category].length > 0 ? (
                <div className="space-y-4">
                  {groupedConcepts[category].map((concept) => (
                    <ConceptCard key={concept.id} concept={concept} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No concepts found in this category matching your search.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

const ConceptCard = ({ concept }: { concept: Concept }) => {
  return (
    <Card key={concept.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{concept.title}</CardTitle>
          <Badge variant="outline" className="capitalize">
            {concept.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{concept.description}</p>
        <div className="flex flex-wrap gap-2 mt-3 mb-4">
          {concept.keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
        {concept.docLink && (
          <Button variant="outline" size="sm" asChild className="mt-2">
            <a href={concept.docLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Documentation
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ConceptExplorer;
