
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save } from 'lucide-react';
import CodeHighlighter from '../CodeHighlighter';

interface GeneratedCodeProps {
  code: string;
  title: string;
  onTitleChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  isUserAuthenticated: boolean;
}

const GeneratedCode = ({
  code,
  title,
  onTitleChange,
  onSave,
  isSaving,
  isUserAuthenticated
}: GeneratedCodeProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Title for this snippet"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={isSaving}
        />
      </div>
      
      <CodeHighlighter 
        code={code} 
        language="move"
        showLineNumbers={true}
        title="Generated Code"
      />
      
      <Button 
        onClick={onSave} 
        disabled={!code || !title.trim() || isSaving || !isUserAuthenticated}
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
  );
};

export default GeneratedCode;
