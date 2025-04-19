
import { useState } from 'react';
import { Loader2, Code as CodeIcon, Save, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCodeGenerator } from '@/hooks/useCodeGenerator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import CodeHighlighter from './CodeHighlighter';

const ImprovedCodeGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { generateCode, isGenerating, result } = useCodeGenerator();
  const { user } = useAuth();

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return;
    
    await generateCode(prompt);
    
    // Set a default title based on the prompt
    if (!title && prompt) {
      setTitle(prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt);
    }
  };
  
  const handleSaveSnippet = async () => {
    if (!result?.code || !title || !user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase.from('code_snippets').insert({
        user_id: user.id,
        title: title.trim(),
        content: result.code
      });
      
      if (error) throw error;
      
      toast({
        title: 'Saved',
        description: 'Code snippet saved to your collection',
      });
      
    } catch (error) {
      console.error('Error saving snippet:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save code snippet',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Example prompts
  const examplePrompts = [
    "Create a basic NFT module with minting and transfer functions",
    "Implement a coin with custom balance tracking",
    "Write a shared object for managing user profiles",
    "Create a module for tracking voting results"
  ];

  const handleUseExample = (example: string) => {
    setPrompt(example);
    generateCode(example);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CodeIcon className="h-5 w-5" />
          AI Code Generator
        </CardTitle>
        <CardDescription>
          Describe the code you want to create, and our AI will generate Sui Move code for you
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Describe what you want to build (e.g., 'Create a struct for tracking votes')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1"
              disabled={isGenerating}
            />
            <Button 
              onClick={handleGenerateCode} 
              disabled={!prompt.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {examplePrompts.map((examplePrompt) => (
              <Button 
                key={examplePrompt} 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleUseExample(examplePrompt)}
                disabled={isGenerating}
              >
                <Lightbulb className="mr-1 h-3 w-3" />
                {examplePrompt.length > 30 ? examplePrompt.substring(0, 30) + '...' : examplePrompt}
              </Button>
            ))}
          </div>
        </div>
        
        {isGenerating && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {result && (
          <div className="space-y-4">
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Title for this snippet"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <CodeHighlighter 
                  code={result.code} 
                  language="move"
                  showLineNumbers={true}
                  title="Generated Code"
                />
                
                <Button 
                  onClick={handleSaveSnippet} 
                  disabled={!title || isSaving || !user}
                  variant="outline"
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Snippet
                    </>
                  )}
                </Button>
              </TabsContent>
              
              <TabsContent value="explanation">
                <Card className="border p-4">
                  <div className="prose prose-sm max-w-none">
                    <p>{result.explanation || "No additional explanation provided."}</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImprovedCodeGenerator;
