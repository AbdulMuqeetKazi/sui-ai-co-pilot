
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lightbulb } from 'lucide-react';

interface GenerationFormProps {
  prompt: string;
  isGenerating: boolean;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  onExampleClick: (example: string) => void;
  examplePrompts: string[];
}

const GenerationForm = ({
  prompt,
  isGenerating,
  onPromptChange,
  onGenerate,
  onExampleClick,
  examplePrompts
}: GenerationFormProps) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Describe what you want to build (e.g., 'Create a struct for tracking votes')"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="flex-1"
          disabled={isGenerating}
        />
        <Button 
          onClick={onGenerate} 
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
            onClick={() => onExampleClick(examplePrompt)}
            disabled={isGenerating}
          >
            <Lightbulb className="mr-1 h-3 w-3" />
            {examplePrompt.length > 30 ? examplePrompt.substring(0, 30) + '...' : examplePrompt}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GenerationForm;
