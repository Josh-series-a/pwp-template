
import React, { useState } from 'react';
import { apiService, type AnalysisDocument } from "@/utils/apiService";
import { useToast } from "@/components/ui/use-toast";
import DropZone from './upload/DropZone';
import DocumentList from './upload/DocumentList';

const UploadForm = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<AnalysisDocument[]>([]);
  const { toast } = useToast();

  const handleUploadFiles = async (files: FileList) => {
    setIsUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file type and size
        if (!['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
          toast({
            title: "Invalid file type",
            description: "Please upload PDF, TXT, or DOCX files only.",
            variant: "destructive"
          });
          continue;
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast({
            title: "File too large",
            description: "Maximum file size is 10MB.",
            variant: "destructive"
          });
          continue;
        }
        
        const document = await apiService.uploadDocument(file);
        setDocuments(prev => [...prev, document]);
        
        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully.`,
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files.",
        variant: "destructive"
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
        title: "File removed",
        description: "The document has been removed from your analysis.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove document.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <DropZone 
        isUploading={isUploading}
        onFilesSelected={handleUploadFiles}
      />

      <DocumentList 
        documents={documents}
        onDeleteDocument={handleDeleteDocument}
      />
    </div>
  );
};

export default UploadForm;
