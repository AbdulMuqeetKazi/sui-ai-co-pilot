
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Code, Copy, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const CodeSnippetGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const handleGenerateCode = async () => {
    if (!prompt.trim() || !user) return;
    
    setIsGenerating(true);
    setGeneratedCode('');
    
    try {
      const context = {
        userId: user.id,
        task: 'code_generation',
        language: 'move', // Default to Move language
      };
      
      const { data, error } = await supabase.functions.invoke('askAI', {
        body: JSON.stringify({ 
          prompt: `Generate a Sui Move code snippet for: ${prompt}. 
                   Only provide the code, no explanations. 
                   Make sure the code is syntactically correct, well-commented, and follows best practices.`,
          context
        })
      });
      
      if (error) throw error;
      
      // Extract code from the response (remove markdown code block syntax if present)
      let code = data.response;
      const codeBlockMatch = code.match(/```[\w]*\n([\s\S]*?)```/);
      if (codeBlockMatch) {
        code = codeBlockMatch[1].trim();
      }
      
      setGeneratedCode(code);
      
      // Suggest a title based on the prompt
      if (!title) {
        setTitle(prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt);
      }
      
      // Log to prompt history
      await supabase.from('prompt_history').insert({
        user_id: user.id,
        prompt,
        response: data.response,
        type: 'code_generation',
        tokens_used: data.tokens || 0
      });
      
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate code. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveSnippet = async () => {
    if (!generatedCode || !title.trim() || !user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase.from('code_snippets').insert({
        user_id: user.id,
        title: title.trim(),
        content: generatedCode
      });
      
      if (error) throw error;
      
      toast({
        title: 'Saved',
        description: 'Code snippet saved successfully.',
      });
      
      // Reset the form after saving
      setPrompt('');
      setGeneratedCode('');
      setTitle('');
      
    } catch (error) {
      console.error('Error saving code snippet:', error);
      toast({
        title: 'Error',
        description: 'Failed to save code snippet. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCopyToClipboard = () => {
    if (!generatedCode) return;
    
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: 'Copied',
      description: 'Code copied to clipboard.'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Code className="h-5 w-5" />
          Code Snippet Generator
        </CardTitle>
        <CardDescription>
          Generate Sui Move code snippets from natural language descriptions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Describe the code you want to generate (e.g., 'Create a struct for a coffee shop')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            className="w-full"
          />
          <Button 
            onClick={handleGenerateCode} 
            disabled={!prompt.trim() || isGenerating || !user}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Code'
            )}
          </Button>
        </div>
        
        {generatedCode && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Title for this snippet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSaving}
              />
            </div>
            
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                <code className="language-move">{generatedCode}</code>
              </pre>
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleCopyToClipboard}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handleSaveSnippet} 
              disabled={!generatedCode || !title.trim() || isSaving || !user}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeSnippetGenerator;
