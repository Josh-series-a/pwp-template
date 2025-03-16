
import React, { useState, useRef } from 'react';
import { Check, Loader2, UploadCloud, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { apiService, type AnalysisDocument } from "@/utils/apiService";
import { useToast } from "@/components/ui/use-toast";
import TransitionWrapper from './TransitionWrapper';

const UploadForm = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<AnalysisDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(e.target.files);
    }
  };

  const uploadFiles = async (files: FileList) => {
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <TransitionWrapper animation="slide-up">
        <div 
          className={`border-2 border-dashed rounded-2xl p-8 text-center ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          } transition-colors duration-200 cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleFileInputChange}
            multiple
            accept=".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <UploadCloud className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Upload Business Documents</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Drag and drop your files here, or click to browse. 
                Support for PDF, TXT, and DOCX (max 10MB).
              </p>
            </div>
            
            <Button
              disabled={isUploading}
              className="mt-4"
              variant="outline"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>Select Files</>
              )}
            </Button>
          </div>
        </div>
      </TransitionWrapper>

      {documents.length > 0 && (
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
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-1 rounded-full hover:bg-secondary text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </TransitionWrapper>
      )}
    </div>
  );
};

export default UploadForm;
