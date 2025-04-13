
import { Bot, User } from 'lucide-react';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div 
      className={`flex gap-3 ${message.role === 'assistant' ? 'mr-8' : 'ml-8'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
        ${message.role === 'assistant' ? 'bg-sui-100 text-sui-800' : 'bg-gray-200'}`}
      >
        {message.role === 'assistant' ? (
          <Bot className="h-5 w-5" />
        ) : (
          <User className="h-5 w-5" />
        )}
      </div>
      
      <div className={`p-3 rounded-lg ${
        message.role === 'assistant' 
          ? 'bg-card border' 
          : 'bg-primary text-primary-foreground'
      }`}
      >
        <div className="whitespace-pre-wrap prose prose-sm max-w-none">
          {message.content}
        </div>
        
        {message.codeSnippets && message.codeSnippets.map((snippet, index) => (
          <div key={index} className="mt-2 bg-muted rounded-md p-2 overflow-x-auto">
            <pre className="text-sm">{snippet}</pre>
          </div>
        ))}
        
        {message.references && message.references.length > 0 && (
          <div className="mt-3 pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-1">References:</p>
            <ul className="list-disc list-inside text-xs space-y-1">
              {message.references.map((ref, index) => (
                <li key={index}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {ref.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
