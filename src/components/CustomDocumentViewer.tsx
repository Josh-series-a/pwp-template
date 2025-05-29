
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  isGoogleDocument, 
  getDocumentViewerUrl, 
  getCleanEmbedUrl,
  getDocumentInfo 
} from '@/components/documents/utils/document-utils';

interface CustomDocumentViewerProps {
  docUrl?: string;
  title?: string;
  height?: string;
  className?: string;
  showUrlInput?: boolean;
}

const CustomDocumentViewer: React.FC<CustomDocumentViewerProps> = ({
  docUrl: initialUrl = '',
  title = 'Document Preview',
  height = '600px',
  className,
  showUrlInput = true
}) => {
  const [docUrl, setDocUrl] = useState(initialUrl);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const processDocumentUrl = (url: string) => {
    if (!url.trim()) return '';
    
    const docInfo = getDocumentInfo(url);
    
    if (docInfo.isGoogleDocument && docInfo.fileId) {
      // Use clean embed URL for minimal Google interface
      return getCleanEmbedUrl(url);
    }
    
    // For non-Google documents, return as-is
    return url;
  };

  const handleLoadDocument = () => {
    if (!docUrl.trim()) return;
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      const processedUrl = processDocumentUrl(docUrl);
      setCurrentUrl(processedUrl);
      
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error processing document URL:', error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const openInNewTab = () => {
    if (docUrl) {
      window.open(docUrl, '_blank');
    }
  };

  useEffect(() => {
    if (initialUrl) {
      const processedUrl = processDocumentUrl(initialUrl);
      setCurrentUrl(processedUrl);
      setDocUrl(initialUrl);
    }
  }, [initialUrl]);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </CardTitle>
          {docUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={openInNewTab}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Original
            </Button>
          )}
        </div>
        
        {showUrlInput && (
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Paste Google Docs URL here..."
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLoadDocument()}
              className="flex-1"
            />
            <Button 
              onClick={handleLoadDocument}
              disabled={!docUrl.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Load'
              )}
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          className="relative border-t bg-white"
          style={{ height }}
        >
          {!currentUrl && !isLoading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Document Loaded</p>
                <p className="text-sm">
                  {showUrlInput 
                    ? "Enter a Google Docs URL above to get started" 
                    : "Provide a document URL to preview"}
                </p>
              </div>
            </div>
          ) : hasError ? (
            <div className="flex items-center justify-center h-full text-destructive">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Failed to Load Document</p>
                <p className="text-sm text-muted-foreground mb-4">
                  The document could not be loaded. Please check the URL and try again.
                </p>
                <Button variant="outline" onClick={handleLoadDocument}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading document...</p>
                  </div>
                </div>
              )}
              
              <div className="w-full h-full overflow-hidden rounded-b-lg">
                <iframe
                  src={currentUrl}
                  className="w-full h-full border-0"
                  title={title}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-scripts allow-same-origin"
                  style={{ 
                    border: 'none',
                    outline: 'none',
                    background: 'white'
                  }}
                />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomDocumentViewer;
