
import { Bot, Loader2 } from 'lucide-react';

const LoadingMessage = () => {
  return (
    <div className="flex gap-3 mr-8">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sui-100 text-sui-800 flex items-center justify-center">
        <Bot className="h-5 w-5" />
      </div>
      <div className="p-3 rounded-lg bg-card border">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-sui-500" />
          <span className="text-sm text-muted-foreground">Generating response...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
