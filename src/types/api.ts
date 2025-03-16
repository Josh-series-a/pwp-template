
// Shared API types 

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
