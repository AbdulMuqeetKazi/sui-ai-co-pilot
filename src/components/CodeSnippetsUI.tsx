
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Copy, Check, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CodeSnippetsUI = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call - replace this with your actual API call
      // For now we'll just generate a dummy response
      const response = await new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(`// Generated code for: ${prompt}\n\nfunction exampleFunction() {\n  console.log("Hello from SuiCoPilot");\n  return "Example response";\n}`);
        }, 1500);
      });
      
      setCode(response);
      
      // Save to Supabase if user is logged in
      if (user) {
        await supabase.from('code_snippets').insert({
          user_id: user.id,
          prompt: prompt,
          code: response
        });
        
        toast({
          title: 'Success',
          description: 'Code snippet saved to your account',
        });
      }
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied',
      description: 'Code copied to clipboard',
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Generate Code Snippets</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium">
                Enter your prompt
              </label>
              <Textarea
                id="prompt"
                placeholder="Describe the code you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-24"
                disabled={loading}
              />
            </div>
            
            <Button type="submit" disabled={loading || !prompt.trim()} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Generate Code
                </>
              )}
            </Button>
          </form>

          {code && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Generated Code</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="p-4 bg-secondary/30 rounded-md overflow-x-auto text-sm">
                <code>{code}</code>
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeSnippetsUI;
