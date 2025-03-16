
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Key } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiService, type ChatMessage } from "@/utils/apiService";
import TransitionWrapper from './TransitionWrapper';
import ApiKeyForm from './ApiKeyForm';

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with any existing chat history
    const history = apiService.getChatHistory();
    if (history.length > 1) { // Skip system message
      setMessages(history.filter(msg => msg.role !== 'system'));
    } else {
      // Add an initial assistant message if no history exists
      const initialMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm your Prosper with Purpose business analysis expert. I've reviewed your uploaded documents. What aspects of your business would you like me to analyze or question?"
      };
      setMessages([initialMessage]);
    }

    // Check if API key is set
    setHasApiKey(!!apiService.getApiKey());
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await apiService.sendMessage(input);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, there was an error processing your request. Please try again or check your API key."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-14rem)]">
      {!hasApiKey && (
        <div className="bg-muted/50 p-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Using mock responses. For full AI capabilities, please set your OpenAI API key.
          </p>
          <ApiKeyForm />
        </div>
      )}
      
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
      
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your business documents..."
            className="rounded-full bg-secondary"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            className="rounded-full shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
