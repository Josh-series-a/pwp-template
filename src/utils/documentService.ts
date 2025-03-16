
import { AnalysisDocument } from "@/types/api";

class DocumentService {
  private documents: AnalysisDocument[] = [];
  private documentContents: Record<string, string> = {}; // Map of document ID to content

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

  // Get document content by ID
  getDocumentContent(id: string): string | undefined {
    return this.documentContents[id];
  }

  // Create a summary of all document contents to provide context to the AI
  getDocumentContext(): string {
    if (this.documents.length === 0) {
      return "No documents have been uploaded yet.";
    }

    const documentSummaries = this.documents.map(doc => {
      const content = this.documentContents[doc.id] || "No content available";
      return `Document: ${doc.name} (${doc.type})\nContent: ${content}\n`;
    });

    return "Here are the documents that have been uploaded for analysis:\n\n" + documentSummaries.join("\n---\n\n");
  }
}

export const documentService = new DocumentService();
