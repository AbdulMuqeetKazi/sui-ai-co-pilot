
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Code as CodeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface CodeHighlighterProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  title?: string;
  className?: string;
}

const CodeHighlighter: React.FC<CodeHighlighterProps> = ({
  code,
  language = 'move',
  showLineNumbers = false,
  title,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const codeLines = code.split('\n');

  return (
    <div className={cn("relative overflow-hidden rounded-md border shadow-sm", className)}>
      {title && (
        <div className="flex items-center justify-between bg-secondary/50 px-4 py-2 border-b">
          <div className="flex items-center">
            <CodeIcon className="mr-2 h-4 w-4" />
            <span className="font-medium text-sm">{title}</span>
          </div>
          <span className="text-xs text-muted-foreground uppercase">{language}</span>
        </div>
      )}

      <div className="relative">
        <pre className={cn(
          "p-4 overflow-x-auto text-sm bg-secondary/10", 
          showLineNumbers && "pl-12"
        )}>
          {showLineNumbers ? (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-secondary/30 flex flex-col items-end pr-2 text-muted-foreground pt-4 select-none">
              {codeLines.map((_, i) => (
                <div key={i} className="text-xs leading-5">{i + 1}</div>
              ))}
            </div>
          ) : null}
          <code className={`language-${language}`}>{code}</code>
        </pre>

        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-2 right-2 h-8 w-8 opacity-70 hover:opacity-100"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default CodeHighlighter;
