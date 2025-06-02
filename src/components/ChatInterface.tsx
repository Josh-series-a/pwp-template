
import React, { useState, useEffect } from 'react';
import { apiService, type ChatMessage } from "@/utils/apiService";
import { useToast } from "@/hooks/use-toast";
import MessageList from './chat/MessageList';
import MessageInputForm from './chat/MessageInputForm';
import ApiKeyBanner from './chat/ApiKeyBanner';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

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
      
      <Card className="flex-1 flex flex-col border-0 shadow-none bg-transparent">
        <CardHeader className="pb-2 pt-3 px-4 md:px-6">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Ask AI
          </CardTitle>
        </CardHeader>
        
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
        />
        
        <MessageInputForm 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
        />
      </Card>
    </div>
  );
};

export default ChatInterface;
