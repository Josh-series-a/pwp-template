
// Facade for API services that connects to all the specialized services

import { ChatMessage, AnalysisDocument } from "@/types/api";
import { documentService } from "./documentService";
import { chatService } from "./chatService";
import { authService } from "./authService";

class ApiService {
  // Auth methods
  setApiKey(key: string) {
    return authService.setApiKey(key);
  }

  getApiKey(): string | null {
    return authService.getApiKey();
  }

  // Document methods
  async uploadDocument(file: File): Promise<AnalysisDocument> {
    return documentService.uploadDocument(file);
  }

  async getDocuments(): Promise<AnalysisDocument[]> {
    return documentService.getDocuments();
  }

  async deleteDocument(id: string): Promise<boolean> {
    return documentService.deleteDocument(id);
  }

  // Chat methods
  async sendMessage(content: string): Promise<ChatMessage> {
    return chatService.sendMessage(content);
  }

  getChatHistory(): ChatMessage[] {
    return chatService.getChatHistory();
  }

  // Expose types for backwards compatibility
  // These are now imported from @/types/api
}

export type { ChatMessage, AnalysisDocument } from "@/types/api";
export const apiService = new ApiService();
