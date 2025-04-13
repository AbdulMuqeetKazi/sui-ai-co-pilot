
import { Bot, Sparkles, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onClearChat: () => void;
}

const ChatHeader = ({ onClearChat }: ChatHeaderProps) => {
  return (
    <div className="bg-sui-900 text-white py-3 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5" />
        <h3 className="font-medium">SuiCoPilot Chat</h3>
        <div className="flex items-center gap-1 bg-sui-700 px-2 py-0.5 rounded-full text-xs ml-2">
          <Sparkles className="h-3 w-3" />
          <span>AI Powered</span>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClearChat}
        className="text-white hover:text-white/80 hover:bg-sui-800"
      >
        <XCircle className="h-4 w-4 mr-1" />
        Clear
      </Button>
    </div>
  );
};

export default ChatHeader;
