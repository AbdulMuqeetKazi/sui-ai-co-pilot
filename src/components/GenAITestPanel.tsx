
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, BrainCircuit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CodeOutput from './CodeOutput';

interface AITestResult {
  response: string;
  stats: {
    model: string;
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    processing_time_ms: number;
    estimated_cost_usd: string;
  };
}

const GenAITestPanel = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('gpt-4o-mini');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [includeContext, setIncludeContext] = useState(true);
  const [result, setResult] = useState<AITestResult | null>(null);
  
  const handleSubmit = async () => {
    if (!prompt.trim() || !user) return;
    
    setIsLoading(true);
    setResponse('');
    setResult(null);
    
    try {
      const context = includeContext 
        ? { task: 'debug_assistance', userId: user.id }
        : undefined;
      
      const { data, error } = await supabase.functions.invoke('askAI', {
        body: JSON.stringify({
          prompt,
          context,
          model,
          temperature,
          max_tokens: maxTokens
        })
      });
      
      if (error) throw error;
      
      setResponse(data.response);
      setResult({
        response: data.response,
        stats: data.stats
      });
      
      // Log to prompt history
      await supabase.from('prompt_history').insert({
        user_id: user.id,
        prompt,
        response: data.response,
        type: 'ai_test',
        tokens_used: data.stats?.total_tokens || data.tokens?.total_tokens || 0
      });
      
    } catch (error) {
      console.error('Error testing AI:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response from AI service",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5" />
            AI Model Configuration
          </CardTitle>
          <CardDescription>
            Customize AI parameters to test different configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="temperature">Temperature: {temperature}</Label>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              Lower values produce more deterministic responses, higher values more creative ones
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="maxTokens">Max Tokens: {maxTokens}</Label>
            </div>
            <Slider
              id="maxTokens"
              min={100}
              max={2000}
              step={100}
              value={[maxTokens]}
              onValueChange={(value) => setMaxTokens(value[0])}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="includeContext"
              checked={includeContext}
              onCheckedChange={setIncludeContext}
            />
            <Label htmlFor="includeContext">Include context data</Label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Prompt</CardTitle>
          <CardDescription>
            Enter a prompt to test the AI with the configuration above
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your prompt here..."
            className="min-h-32"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim() || !user}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Submit Test Prompt'
            )}
          </Button>
        </CardContent>
      </Card>
      
      {(isLoading || response) && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            {result?.stats && (
              <CardDescription>
                {result.stats.total_tokens} tokens used • ${result.stats.estimated_cost_usd} estimated cost
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }} />
              </div>
            )}
            
            {result?.stats && (
              <Card className="mt-4">
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-xs space-y-1">
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Model:</span>
                      <span>{result.stats.model}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Prompt tokens:</span>
                      <span>{result.stats.prompt_tokens}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Completion tokens:</span>
                      <span>{result.stats.completion_tokens}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Total tokens:</span>
                      <span>{result.stats.total_tokens}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Processing time:</span>
                      <span>{(result.stats.processing_time_ms / 1000).toFixed(2)}s</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-muted-foreground">Estimated cost:</span>
                      <span>${result.stats.estimated_cost_usd}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GenAITestPanel;
