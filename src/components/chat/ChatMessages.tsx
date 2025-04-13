
import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from './types';
import ChatMessage from './ChatMessage';
import LoadingMessage from './LoadingMessage';
import EmptyState from './EmptyState';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && <LoadingMessage />}
        </div>
      )}
    </ScrollArea>
  );
};

export default ChatMessages;
