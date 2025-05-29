import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoogleDocPreviewerProps {
  docUrl?: string;
  title?: string;
  height?: string;
  className?: string;
  showUrlInput?: boolean;
}

const GoogleDocPreviewer: React.FC<GoogleDocPreviewerProps> = ({
  docUrl: initialUrl = '',
  title = 'Document Preview',
  height = '600px',
  className,
  showUrlInput = true
}) => {
  const [docUrl, setDocUrl] = useState(initialUrl);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const formatGoogleDocUrl = (url: string): string => {
    if (!url) return '';
    
    // Extract document ID from various Google Docs URL formats
    const patterns = [
      /\/document\/d\/([a-zA-Z0-9-_]+)/,
      /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
      /\/presentation\/d\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const docId = match[1];
        
        // Determine document type and return appropriate embed URL with parameters to hide editor
        if (url.includes('spreadsheets')) {
          return `https://docs.google.com/spreadsheets/d/${docId}/embed?widget=true&headers=false`;
        } else if (url.includes('presentation')) {
          return `https://docs.google.com/presentation/d/${docId}/embed?start=false&loop=false&delayms=3000`;
        } else {
          return `https://docs.google.com/document/d/${docId}/embed?embedded=true`;
        }
      }
    }

    // If already an embed URL, return as is
    if (url.includes('/embed')) {
      return url;
    }

    // If no pattern matches, assume it's already a valid URL
    return url;
  };

  const handleLoadDocument = () => {
    if (!docUrl.trim()) return;
    
    setIsLoading(true);
    setHasError(false);
    
    const formattedUrl = formatGoogleDocUrl(docUrl);
    setCurrentUrl(formattedUrl);
    
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
    if (currentUrl) {
      window.open(currentUrl, '_blank');
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </CardTitle>
          {currentUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={openInNewTab}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
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
          className="relative border-t"
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
              
              <iframe
                src={currentUrl}
                className="w-full h-full border-0 rounded-b-lg"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={title}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleDocPreviewer;
