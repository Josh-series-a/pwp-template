
import React, { useState, useRef } from 'react';
import { Send, PaperclipIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputFormProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const MessageInputForm = ({ onSendMessage, isLoading }: MessageInputFormProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input);
    setInput('');
  };

  // Auto-resize textarea based on content
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Reset height to auto to get the correct scrollHeight
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      
      // Set the height to scrollHeight to adjust to content
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120); // Max height of 120px
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  // Handle Enter key to submit the form
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex items-end gap-2">
        <div className="relative flex-1 bg-secondary rounded-lg">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your business documents..."
            className="min-h-[40px] max-h-[120px] bg-secondary border-none resize-none overflow-hidden pt-3 pb-1 px-4"
            disabled={isLoading}
            rows={1}
          />
          <div className="text-xs text-muted-foreground p-1 text-right hidden">
            <kbd className="px-1 bg-muted rounded text-[10px]">Shift + Enter</kbd> for new line
          </div>
        </div>
        
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || !input.trim()}
          className="rounded-full shrink-0 h-10 w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default MessageInputForm;
