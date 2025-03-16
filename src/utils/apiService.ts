
// API service for connecting to OpenAI's GPT and managing documents

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AnalysisDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
}

class ApiService {
  private documents: AnalysisDocument[] = [];
  private chatHistory: ChatMessage[] = [
    {
      role: 'system',
      content: 'You are a business analysis expert for Prosper with Purpose. Ask insightful questions about the documents uploaded and provide analysis to help the business grow sustainably.'
    }
  ];
  private apiKey: string | null = null;

  // Set the OpenAI API key
  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
    return true;
  }

  // Get the OpenAI API key
  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openai_api_key');
    }
    return this.apiKey;
  }

  // Mock document upload
  async uploadDocument(file: File): Promise<AnalysisDocument> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const newDocument = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date()
        };
        
        this.documents.push(newDocument);
        resolve(newDocument);
      }, 1500);
    });
  }

  // Get all documents
  async getDocuments(): Promise<AnalysisDocument[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.documents]);
      }, 300);
    });
  }

  // Delete a document
  async deleteDocument(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.documents = this.documents.filter(doc => doc.id !== id);
        resolve(true);
      }, 500);
    });
  }

  // Send a message to the OpenAI API
  async sendMessage(content: string): Promise<ChatMessage> {
    // Add user message to history
    this.chatHistory.push({
      role: 'user',
      content
    });
    
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      // If no API key, use mock response
      return this.sendMockMessage();
    }
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: this.chatHistory,
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
      
      // Simulate AI thinking
      setTimeout(() => {
        // Mock responses based on keywords
        let response = '';
        
        if (lastUserMessage.toLowerCase().includes('market') || lastUserMessage.toLowerCase().includes('analysis')) {
          response = "Based on the documents you've uploaded, I can see several market trends worth exploring. Would you like me to analyze the competitive landscape or focus on customer segments first?";
        } else if (lastUserMessage.toLowerCase().includes('strategy') || lastUserMessage.toLowerCase().includes('plan')) {
          response = "Your strategic documents reveal some interesting approaches. Have you considered how these align with the current market disruptions we're seeing in your industry?";
        } else if (lastUserMessage.toLowerCase().includes('data') || lastUserMessage.toLowerCase().includes('metrics')) {
          response = "The data points in your documents show some patterns worth investigating. What specific metrics are you most interested in improving in the next quarter?";
        } else {
          response = "That's an interesting point. Based on your uploaded documents, I'd like to ask how you're planning to address the challenges in section 3? The competitive analysis suggests several approaches worth considering.";
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

export const apiService = new ApiService();
