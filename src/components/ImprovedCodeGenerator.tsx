import { useState } from 'react';
import { Loader2, Code } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCodeGenerator } from '@/hooks/useCodeGenerator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import GenerationForm from './code-generator/GenerationForm';
import GeneratedCode from './code-generator/GeneratedCode';

const examplePrompts = [
  "Create a basic NFT module with minting and transfer functions",
  "Implement a coin with custom balance tracking",
  "Write a shared object for managing user profiles",
  "Create a module for tracking voting results"
];

const ImprovedCodeGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const { generateCode, isGenerating, result } = useCodeGenerator();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return;
    
    await generateCode(prompt);
    
    // Set a default title based on the prompt
    if (!title && prompt) {
      setTitle(prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    generateCode(example);
  };

  const handleSaveSnippet = async () => {
    if (!result?.code || !title.trim() || !user) return;
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
        description: 'Code snippet saved successfully.',
      });
      
      // Reset the form
      setPrompt('');
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          AI Code Generator
        </CardTitle>
        <CardDescription>
          Describe the code you want to create, and our AI will generate Sui Move code for you
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <GenerationForm 
          prompt={prompt}
          isGenerating={isGenerating}
          onPromptChange={setPrompt}
          onGenerate={handleGenerateCode}
          onExampleClick={handleExampleClick}
          examplePrompts={examplePrompts}
        />
        
        {isGenerating && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {result && (
          <GeneratedCode 
            code={result.code}
            title={title}
            onTitleChange={setTitle}
            onSave={handleSaveSnippet}
            isSaving={isSaving}
            isUserAuthenticated={!!user}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ImprovedCodeGenerator;
