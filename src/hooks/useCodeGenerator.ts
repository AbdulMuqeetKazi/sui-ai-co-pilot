
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface CodeGeneratorResult {
  code: string;
  explanation: string;
}

export const useCodeGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CodeGeneratorResult | null>(null);
  const { user } = useAuth();

  const generateCode = async (prompt: string) => {
    if (!prompt.trim()) {
      toast({
        title: "Invalid prompt",
        description: "Please enter a valid prompt to generate code",
        variant: "destructive"
      });
      return null;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const context = {
        task: 'code_generation',
        language: 'move', 
      };

      if (user) {
        context['userId'] = user.id;
      }

      const { data, error } = await supabase.functions.invoke('askAI', {
        body: JSON.stringify({
          prompt: `Generate Sui Move code for: ${prompt}. Include explanatory comments in the code.`,
          context
        })
      });

      if (error) throw error;

      // Extract code and explanation
      const response = data.response;
      
      // Try to extract code blocks marked with triple backticks
      const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
      let match;
      let extractedCode = '';
      
      if ((match = codeBlockRegex.exec(response)) !== null) {
        extractedCode = match[1].trim();
      } else {
        // If no code block, use the whole response as code
        extractedCode = response;
      }
      
      // The rest is explanation
      const explanation = response.replace(codeBlockRegex, '').trim();

      const generatedResult = {
        code: extractedCode,
        explanation
      };

      setResult(generatedResult);

      // Log to prompt history if user is authenticated
      if (user) {
        await supabase.from('prompt_history').insert({
          user_id: user.id,
          prompt: prompt,
          response: response,
          type: 'code_generation',
          tokens_used: data.tokens?.total_tokens || 0
        });
      }

      return generatedResult;
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: "Generation failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateCode,
    isGenerating,
    result
  };
};
