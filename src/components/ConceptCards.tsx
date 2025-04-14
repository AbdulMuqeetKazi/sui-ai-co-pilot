
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Search, Database, Code, Blocks, Wallet, FileCode, Key } from 'lucide-react';
import { concepts } from '@/lib/concepts';

// Define a type for concept categories
type ConceptCategory = 'all' | 'basics' | 'advanced' | 'development' | 'tools';

const ConceptCards = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ConceptCategory>('all');
  const [filteredConcepts, setFilteredConcepts] = useState(concepts);

  // Filter concepts based on search query and active category
  useEffect(() => {
    let filtered = concepts;
    
    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(concept => concept.category === activeCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        concept => 
          concept.title.toLowerCase().includes(query) || 
          concept.description.toLowerCase().includes(query) ||
          concept.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }
    
    setFilteredConcepts(filtered);
  }, [searchQuery, activeCategory]);

  // Get icon for concept
  const getConceptIcon = (id: string) => {
    switch (id) {
      case 'move-language':
        return <FileCode className="w-5 h-5" />;
      case 'sui-objects':
        return <Blocks className="w-5 h-5" />;
      case 'transaction-blocks':
        return <Code className="w-5 h-5" />;
      case 'gas-fees':
        return <Wallet className="w-5 h-5" />;
      case 'sui-addresses':
        return <Key className="w-5 h-5" />;
      case 'sui-cli':
        return <Database className="w-5 h-5" />;
      default:
        return <Code className="w-5 h-5" />;
    }
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basics':
        return 'bg-blue-100 text-blue-700';
      case 'advanced':
        return 'bg-purple-100 text-purple-700';
      case 'development':
        return 'bg-green-100 text-green-700';
      case 'tools':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Sui Concepts</h2>
      
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search concepts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('all')}
          >
            All
          </Button>
          <Button
            variant={activeCategory === 'basics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('basics')}
          >
            Basics
          </Button>
          <Button
            variant={activeCategory === 'advanced' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('advanced')}
          >
            Advanced
          </Button>
          <Button
            variant={activeCategory === 'development' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('development')}
          >
            Development
          </Button>
          <Button
            variant={activeCategory === 'tools' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('tools')}
          >
            Tools
          </Button>
        </div>
      </div>
      
      {/* Display no results message */}
      {filteredConcepts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No concepts found matching your search criteria.</p>
        </div>
      )}
      
      {/* Concept cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConcepts.map((concept) => (
          <Card key={concept.id} className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                {getConceptIcon(concept.id)}
                <CardTitle className="text-lg">{concept.title}</CardTitle>
              </div>
              <Badge 
                variant="outline" 
                className={`${getCategoryColor(concept.category)} capitalize`}
              >
                {concept.category}
              </Badge>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-sm text-foreground/80">
                {concept.description}
              </CardDescription>
            </CardContent>
            {concept.docLink && (
              <CardFooter className="pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-primary" 
                  onClick={() => window.open(concept.docLink, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Documentation
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConceptCards;
