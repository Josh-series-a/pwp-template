
// This is a placeholder for the actual API integration with GPT.
// In a real implementation, you would connect to OpenAI's API or your custom GPT endpoint.

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
      content: 'You are a business analysis expert. Ask insightful questions about the documents uploaded and provide analysis.'
    }
  ];

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

  // Send a message to the AI
  async sendMessage(content: string): Promise<ChatMessage> {
    return new Promise((resolve) => {
      // Add user message to history
      this.chatHistory.push({
        role: 'user',
        content
      });
      
      // Simulate AI thinking
      setTimeout(() => {
        // Mock responses based on keywords
        let response = '';
        
        if (content.toLowerCase().includes('market') || content.toLowerCase().includes('analysis')) {
          response = "Based on the documents you've uploaded, I can see several market trends worth exploring. Would you like me to analyze the competitive landscape or focus on customer segments first?";
        } else if (content.toLowerCase().includes('strategy') || content.toLowerCase().includes('plan')) {
          response = "Your strategic documents reveal some interesting approaches. Have you considered how these align with the current market disruptions we're seeing in your industry?";
        } else if (content.toLowerCase().includes('data') || content.toLowerCase().includes('metrics')) {
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
