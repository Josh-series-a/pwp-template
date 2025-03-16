
import { ChatMessage } from "@/types/api";
import { documentService } from "./documentService";
import { authService } from "./authService";

class ChatService {
  private chatHistory: ChatMessage[] = [
    {
      role: 'system',
      content: 'You are a business analysis expert for Prosper with Purpose. Ask insightful questions about the documents uploaded and provide analysis to help the business grow sustainably.'
    }
  ];

  // Send a message to the OpenAI API
  async sendMessage(content: string): Promise<ChatMessage> {
    // Add user message to history
    this.chatHistory.push({
      role: 'user',
      content
    });
    
    const apiKey = authService.getApiKey();
    
    if (!apiKey) {
      // If no API key, use mock response
      return this.sendMockMessage();
    }
    
    try {
      // Create an updated system message with document context
      const documentContext = documentService.getDocumentContext();
      const messagesWithContext = [
        {
          role: 'system' as const,
          content: `You are a business analysis expert for Prosper with Purpose. Ask insightful questions about the documents uploaded and provide analysis to help the business grow sustainably. Here are the documents that have been uploaded for your reference:\n\n${documentContext}`
        },
        ...this.chatHistory.filter(msg => msg.role !== 'system')
      ];
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: messagesWithContext,
          temperature: 0.7,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API error:', error);
        throw new Error(error.error?.message || 'Failed to get response from OpenAI');
      }
      
      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
      };
      
      // Add assistant response to history
      this.chatHistory.push(assistantMessage);
      return assistantMessage;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return this.sendMockMessage();
    }
  }
  
  // Send a mock message (fallback when API key is not available or API call fails)
  private async sendMockMessage(): Promise<ChatMessage> {
    return new Promise((resolve) => {
      // Get the last user message
      const lastUserMessage = this.chatHistory.filter(msg => msg.role === 'user').pop()?.content || '';
      
      // Get document content for context-aware mock responses
      const documentContext = documentService.getDocumentContext();
      const documents = documentService.getDocuments();
      
      // Simulate AI thinking
      setTimeout(() => {
        // Mock responses based on keywords and document content
        let response = '';
        
        if (documentContext.includes("No documents have been uploaded yet")) {
          response = "I don't see any documents uploaded yet. Please upload your business documents so I can provide analysis based on their content.";
        } else if (lastUserMessage.toLowerCase().includes('market') || lastUserMessage.toLowerCase().includes('analysis')) {
          response = `Based on the documents you've uploaded, I can see several market trends worth exploring. Your documents mention some interesting points. Would you like me to analyze the competitive landscape or focus on customer segments first?`;
        } else if (lastUserMessage.toLowerCase().includes('strategy') || lastUserMessage.toLowerCase().includes('plan')) {
          response = `I've analyzed your strategic documents. Have you considered how these align with the current market disruptions we're seeing in your industry?`;
        } else if (lastUserMessage.toLowerCase().includes('data') || lastUserMessage.toLowerCase().includes('metrics')) {
          response = `The data points in your uploaded documents show some patterns worth investigating. What specific metrics are you most interested in improving in the next quarter?`;
        } else if (lastUserMessage.toLowerCase().includes('summary')) {
          response = `Here's a brief summary of your uploaded documents:\n\n${documentContext}\n\nIs there a specific aspect of these documents you'd like me to analyze further?`;
        } else {
          response = `That's an interesting point. Based on your uploaded documents, I'd like to ask how you're planning to address the challenges mentioned? The content suggests several approaches worth considering.`;
        }
        
        const assistantMessage = {
          role: 'assistant' as const,
          content: response
        };
        
        // Add assistant response to history
        this.chatHistory.push(assistantMessage);
        resolve(assistantMessage);
      }, 2000);
    });
  }

  // Get chat history
  getChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }
}

export const chatService = new ChatService();
