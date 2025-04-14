
import { useState } from 'react';
import { Search, Copy } from 'lucide-react';
import { codeSnippets } from '@/lib/code-snippets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const CodeSnippetGenerator = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter snippets based on search query
  const filteredSnippets = Object.entries(codeSnippets).filter(([key, value]) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      key.toLowerCase().includes(lowerCaseQuery) || 
      value.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: `${name} snippet has been copied.`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 gradient-text">Sui Code Snippets</h1>
      <p className="text-muted-foreground mb-6">
        Browse and use common Sui Move code patterns for your development
      </p>

      <div className="flex items-center relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Search snippets by name or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredSnippets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No snippets found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSnippets.map(([key, code]) => (
            <Card key={key} className="overflow-hidden">
              <CardHeader className="bg-secondary/20 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(code, key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Badge variant="outline" className="mt-2">{code.includes('module') ? 'Module' : 'Function'}</Badge>
              </CardHeader>
              <CardContent className="p-0">
                <pre className="code-block overflow-x-auto text-xs p-4 max-h-72">
                  <code>{code}</code>
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeSnippetGenerator;
