
export interface AnalysisDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  content?: string;
}

class ApiService {
  private apiKey: string | null = null;

  constructor() {
    // Load API key from localStorage on initialization
    this.apiKey = localStorage.getItem('openai_api_key');
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }

  getApiKey(): string | null {
    return this.apiKey || localStorage.getItem('openai_api_key');
  }

  async uploadDocument(file: File): Promise<AnalysisDocument> {
    // Simulate document upload by storing in localStorage
    const document: AnalysisDocument = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    };

    // Get existing documents from localStorage
    const existingDocs = this.getDocuments();
    const updatedDocs = [...existingDocs, document];
    
    localStorage.setItem('uploaded_documents', JSON.stringify(updatedDocs));
    
    return document;
  }

  async getDocuments(): Promise<AnalysisDocument[]> {
    const stored = localStorage.getItem('uploaded_documents');
    return stored ? JSON.parse(stored) : [];
  }

  async deleteDocument(id: string): Promise<void> {
    const existingDocs = await this.getDocuments();
    const filteredDocs = existingDocs.filter(doc => doc.id !== id);
    localStorage.setItem('uploaded_documents', JSON.stringify(filteredDocs));
  }
}

export const apiService = new ApiService();
