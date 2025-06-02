
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from "@/types/api";
import TransitionWrapper from '../TransitionWrapper';
import { Loader2 } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message, index) => (
        <TransitionWrapper 
          key={index} 
          animation="slide-up" 
          delay={index * 100}
          className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
        >
          <div 
            className={`max-w-[80%] rounded-2xl p-4 ${
              message.role === 'assistant' 
                ? 'bg-secondary text-secondary-foreground rounded-tl-sm' 
                : 'bg-primary text-primary-foreground rounded-tr-sm'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </TransitionWrapper>
      ))}
      
      {isLoading && (
        <TransitionWrapper animation="fade" className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl p-4 bg-secondary text-secondary-foreground rounded-tl-sm">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm text-muted-foreground">Analyzing documents...</p>
            </div>
          </div>
        </TransitionWrapper>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
