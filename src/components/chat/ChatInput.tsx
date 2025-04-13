
import { SendHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ChatInput = ({
  input,
  isLoading,
  onInputChange,
  onSendMessage,
  onKeyDown
}: ChatInputProps) => {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Ask about Sui development, Move code, or blockchain concepts..."
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={isLoading}
        className="flex-1"
      />
      <Button 
        onClick={onSendMessage} 
        size="icon" 
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SendHorizontal className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ChatInput;
