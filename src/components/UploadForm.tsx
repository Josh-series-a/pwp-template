
import React, { useState, useEffect } from 'react';
import { apiService, type AnalysisDocument } from "@/utils/apiService";
import { useToast } from "@/hooks/use-toast";
import DropZone from "./upload/DropZone";
import DocumentList from "./upload/DocumentList";

interface UploadFormProps {
  onDocumentUpload?: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onDocumentUpload }) => {
  const [documents, setDocuments] = useState<AnalysisDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const docs = await apiService.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load documents",
        duration: 5000,
      });
    }
  };

  const handleFilesSelected = async (files: FileList) => {
    setIsUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast({
            variant: "destructive",
            title: "File too large",
            description: `${file.name} exceeds the 10MB limit`,
            duration: 5000,
          });
          continue;
        }
        
        // Upload the file
        await apiService.uploadDocument(file);
        
        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully`,
          duration: 3000,
        });
      }
      
      // Refresh the document list
      await fetchDocuments();
      
      // Notify parent component if documents were uploaded
      if (onDocumentUpload) {
        onDocumentUpload();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your file",
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await apiService.deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      
      toast({
        title: "Document deleted",
        description: "The document has been removed",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting your document",
        duration: 5000,
      });
    }
  };

  return (
    <div className="space-y-8">
      <DropZone 
        isUploading={isUploading}
        onFilesSelected={handleFilesSelected}
      />
      
      <DocumentList 
        documents={documents}
        onDeleteDocument={handleDeleteDocument}
      />
    </div>
  );
};

export default UploadForm;
