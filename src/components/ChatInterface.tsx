
import React, { useState, useEffect } from 'react';
import { apiService, type ChatMessage } from "@/utils/apiService";
import { useToast } from "@/hooks/use-toast";
import MessageList from './chat/MessageList';
import MessageInputForm from './chat/MessageInputForm';
import ApiKeyBanner from './chat/ApiKeyBanner';

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const { toast } = useToast();

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

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      role: 'user',
      content
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await apiService.sendMessage(content);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error processing your request. Please check your API key.",
        duration: 5000,
      });
      
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
      {!hasApiKey && <ApiKeyBanner />}
      
      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
      />
      
      <MessageInputForm 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default ChatInterface;
