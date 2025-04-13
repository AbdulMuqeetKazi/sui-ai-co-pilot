
import { Bot } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
      <Bot className="h-12 w-12 mb-4 opacity-50" />
      <p className="text-center max-w-md">
        Ask me about Sui development, Move programming, or blockchain concepts.
        I can help with code snippets, explanations, and best practices.
      </p>
    </div>
  );
};

export default EmptyState;
