
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Search, Loader2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const ConceptExplainer = () => {
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleExplainConcept = async () => {
    if (!query.trim() || !user) return;
    
    setIsLoading(true);
    setExplanation('');
    
    try {
      const context = {
        userId: user.id,
        task: 'concept_explanation',
      };
      
      const { data, error } = await supabase.functions.invoke('askAI', {
        body: JSON.stringify({ 
          prompt: `Explain the Sui blockchain concept: "${query}". 
                   Provide a clear, concise explanation with examples where appropriate. 
                   Include code examples if relevant.`,
          context
        })
      });
      
      if (error) throw error;
      
      setExplanation(data.response);
      
      // Log to prompt history
      await supabase.from('prompt_history').insert({
        user_id: user.id,
        prompt: query,
        response: data.response,
        type: 'concept_explanation',
        tokens_used: data.tokens || 0
      });
      
    } catch (error) {
      console.error('Error explaining concept:', error);
      toast({
        title: 'Error',
        description: 'Failed to explain concept. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyToClipboard = () => {
    if (!explanation) return;
    
    navigator.clipboard.writeText(explanation);
    toast({
      title: 'Copied',
      description: 'Explanation copied to clipboard.'
    });
  };

  // Function to render content with Markdown-like formatting
  const renderExplanation = (content: string) => {
    if (!content) return null;
    
    // Process code blocks
    const processedContent = content.split('```').map((part, index) => {
      if (index % 2 === 0) {
        // Not a code block, process for bold, italic, etc.
        return (
          <div key={index} className="mb-4">
            {part.split('\n').map((line, i) => {
              // Check if it's a heading
              if (line.startsWith('# ')) {
                return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.substring(2)}</h2>;
              } else if (line.startsWith('## ')) {
                return <h3 key={i} className="text-lg font-bold mt-3 mb-1">{line.substring(3)}</h3>;
              } else if (line.startsWith('### ')) {
                return <h4 key={i} className="text-md font-bold mt-2 mb-1">{line.substring(4)}</h4>;
              } else if (line.trim() === '') {
                return <br key={i} />;
              } else {
                // Regular paragraph
                return <p key={i} className="mb-2">{line}</p>;
              }
            })}
          </div>
        );
      } else {
        // Code block
        return (
          <pre key={index} className="bg-muted p-4 rounded-md text-sm overflow-x-auto mb-4">
            <code>{part}</code>
          </pre>
        );
      }
    });
    
    return <div className="mt-4">{processedContent}</div>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Sui Concept Explainer
        </CardTitle>
        <CardDescription>
          Learn about Sui blockchain concepts with detailed explanations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter a Sui concept (e.g., 'object ownership', 'Move modules')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleExplainConcept();
              }
            }}
          />
          <Button 
            onClick={handleExplainConcept} 
            disabled={!query.trim() || isLoading || !user}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {explanation && (
          <div className="relative mt-6 bg-card border rounded-lg p-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleCopyToClipboard}
              className="absolute top-2 right-2"
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
            
            <div className="prose prose-sm max-w-none mt-2">
              {renderExplanation(explanation)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConceptExplainer;
