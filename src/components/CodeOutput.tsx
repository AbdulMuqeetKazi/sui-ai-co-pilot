
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface CodeOutputProps {
  code: string;
  language?: string;
  title?: string;
  copyable?: boolean;
  className?: string;
}

const CodeOutput: React.FC<CodeOutputProps> = ({ 
  code, 
  language = 'move',
  title,
  copyable = true,
  className
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={cn("relative rounded-md overflow-hidden border", className)}>
      {title && (
        <div className="bg-muted px-4 py-2 border-b font-medium text-sm flex justify-between items-center">
          <span>{title}</span>
          {language && <span className="text-xs text-muted-foreground capitalize">{language}</span>}
        </div>
      )}
      
      <div className="relative">
        <pre className={cn(
          "p-4 overflow-x-auto text-sm", 
          !title && "pt-8"
        )}>
          <code>{code}</code>
        </pre>
        
        {copyable && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopy}
            className="absolute top-2 right-2 h-8 w-8 opacity-70 hover:opacity-100"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CodeOutput;
