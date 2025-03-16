
import React from 'react';
import { Check, X } from 'lucide-react';
import { type AnalysisDocument } from "@/utils/apiService";
import TransitionWrapper from '../TransitionWrapper';

interface DocumentListProps {
  documents: AnalysisDocument[];
  onDeleteDocument: (id: string) => Promise<void>;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onDeleteDocument }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (documents.length === 0) return null;

  return (
    <TransitionWrapper animation="slide-up" delay={100}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Uploaded Documents</h3>
        
        <div className="space-y-3">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className="flex items-center justify-between p-4 rounded-lg glass-card"
            >
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(doc.size)} • {new Date(doc.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => onDeleteDocument(doc.id)}
                className="p-1 rounded-full hover:bg-secondary text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default DocumentList;
