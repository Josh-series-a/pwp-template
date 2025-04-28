
import React from 'react';
import { Check, X } from 'lucide-react';
import { type AnalysisDocument } from "@/types/api";
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

  // Since we only allow one document, we'll only show the first one
  const document = documents[0];
  if (!document) return null;

  return (
    <TransitionWrapper animation="slide-up" delay={100}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Uploaded Document</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg glass-card">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">{document.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(document.size)} • {new Date(document.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onDeleteDocument(document.id)}
              className="p-1 rounded-full hover:bg-secondary text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default DocumentList;
