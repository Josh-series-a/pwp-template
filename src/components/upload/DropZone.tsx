
import React, { useState, useRef } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TransitionWrapper from '../TransitionWrapper';

interface DropZoneProps {
  isUploading: boolean;
  onFilesSelected: (files: FileList) => Promise<void>;
}

const DropZone: React.FC<DropZoneProps> = ({ isUploading, onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      await onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await onFilesSelected(e.target.files);
    }
  };

  return (
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
  );
};

export default DropZone;
