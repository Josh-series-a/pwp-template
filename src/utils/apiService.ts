
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
  content?: string; // Store document content
}

class ApiService {
  private documents: AnalysisDocument[] = [];
  private documentContents: Record<string, string> = {}; // Map of document ID to content
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

  // Mock document upload with content extraction
  async uploadDocument(file: File): Promise<AnalysisDocument> {
    return new Promise((resolve) => {
      // Read the file content
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target?.result as string || "No content could be extracted";
        
        // Simulate API delay
        setTimeout(() => {
          const newDocument = {
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date(),
            content // Store content with the document
          };
          
          this.documents.push(newDocument);
          this.documentContents[newDocument.id] = content; // Store content separately for easier reference
          resolve(newDocument);
        }, 1500);
      };
      
      // For text files, read directly as text
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        // For other files, just store the binary data as base64 for now
        // In a real app, you'd use more sophisticated document parsing here
        reader.readAsDataURL(file);
      }
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
        delete this.documentContents[id]; // Clean up the content too
        resolve(true);
      }, 500);
    });
  }

  // Create a summary of all document contents to provide context to the AI
  private getDocumentContext(): string {
    if (this.documents.length === 0) {
      return "No documents have been uploaded yet.";
    }

    const documentSummaries = this.documents.map(doc => {
      const content = this.documentContents[doc.id] || "No content available";
      return `Document: ${doc.name} (${doc.type})\nContent: ${content}\n`;
    });

    return "Here are the documents that have been uploaded for analysis:\n\n" + documentSummaries.join("\n---\n\n");
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
      // Create an updated system message with document context
      const documentContext = this.getDocumentContext();
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
      const documentContext = this.getDocumentContext();
      
      // Simulate AI thinking
      setTimeout(() => {
        // Mock responses based on keywords and document content
        let response = '';
        
        if (this.documents.length === 0) {
          response = "I don't see any documents uploaded yet. Please upload your business documents so I can provide analysis based on their content.";
        } else if (lastUserMessage.toLowerCase().includes('market') || lastUserMessage.toLowerCase().includes('analysis')) {
          response = `Based on the ${this.documents.length} document(s) you've uploaded, I can see several market trends worth exploring. Your document "${this.documents[0].name}" mentions some interesting points. Would you like me to analyze the competitive landscape or focus on customer segments first?`;
        } else if (lastUserMessage.toLowerCase().includes('strategy') || lastUserMessage.toLowerCase().includes('plan')) {
          response = `I've analyzed your strategic documents, particularly "${this.documents[0].name}". Have you considered how these align with the current market disruptions we're seeing in your industry?`;
        } else if (lastUserMessage.toLowerCase().includes('data') || lastUserMessage.toLowerCase().includes('metrics')) {
          response = `The data points in your ${this.documents.length} uploaded document(s) show some patterns worth investigating. What specific metrics from "${this.documents[0].name}" are you most interested in improving in the next quarter?`;
        } else if (lastUserMessage.toLowerCase().includes('summary')) {
          response = `Here's a brief summary of your uploaded documents:\n\n${documentContext}\n\nIs there a specific aspect of these documents you'd like me to analyze further?`;
        } else {
          response = `That's an interesting point. Based on your ${this.documents.length} uploaded document(s), I'd like to ask how you're planning to address the challenges mentioned in "${this.documents[0].name}"? The content suggests several approaches worth considering.`;
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
