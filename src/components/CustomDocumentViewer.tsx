
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [fallbackUrls, setFallbackUrls] = useState<string[]>([]);
  const [currentFallbackIndex, setCurrentFallbackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getDocumentIdFromUrl = (url: string): string | null => {
    const patterns = [
      /\/document\/d\/([a-zA-Z0-9-_]+)/,
      /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
      /\/presentation\/d\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const getViewOnlyUrls = (url: string): string[] => {
    const docId = getDocumentIdFromUrl(url);
    if (!docId) return [url];

    // Return multiple view-only URL formats to try
    const viewUrls = [
      // Standard embedded view (most compatible)
      `https://docs.google.com/document/d/${docId}/pub?embedded=true`,
      // Drive preview mode
      `https://drive.google.com/file/d/${docId}/preview`,
      // Alternative preview format
      `https://docs.google.com/document/d/${docId}/preview`,
      // Google Viewer fallback
      `https://docs.google.com/viewer?url=https://docs.google.com/document/d/${docId}/export?format=pdf&embedded=true`,
      // Direct export as PDF
      `https://docs.google.com/document/d/${docId}/export?format=pdf`
    ];

    return viewUrls;
  };

  const processDocumentUrl = (url: string) => {
    if (!url.trim()) return { processedUrl: '', fallbacks: [] };
    
    try {
      const fallbacks = getViewOnlyUrls(url);
      return { processedUrl: fallbacks[0], fallbacks };
    } catch (error) {
      console.error('Error processing document URL:', error);
      return { processedUrl: url, fallbacks: [url] };
    }
  };

  const handleLoadDocument = () => {
    if (!docUrl.trim()) return;
    
    setIsLoading(true);
    setHasError(false);
    setCurrentFallbackIndex(0);
    
    const { processedUrl, fallbacks } = processDocumentUrl(docUrl);
    setCurrentUrl(processedUrl);
    setFallbackUrls(fallbacks);
    
    console.log('Loading document with URL:', processedUrl);
    console.log('Available fallbacks:', fallbacks);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    console.log('Document loaded successfully');
  };

  const handleIframeError = () => {
    console.log('Iframe error occurred, trying fallback URLs...');
    
    // Try the next fallback URL
    const nextIndex = currentFallbackIndex + 1;
    if (nextIndex < fallbackUrls.length) {
      console.log(`Trying fallback URL ${nextIndex}: ${fallbackUrls[nextIndex]}`);
      setCurrentFallbackIndex(nextIndex);
      setCurrentUrl(fallbackUrls[nextIndex]);
      setIsLoading(true);
      
      // Give it a moment to load
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    } else {
      console.log('All fallback URLs failed');
      setIsLoading(false);
      setHasError(true);
    }
  };

  const openInNewTab = () => {
    if (docUrl) {
      window.open(docUrl, '_blank');
    }
  };

  const tryDifferentUrl = () => {
    handleIframeError();
  };

  useEffect(() => {
    if (initialUrl) {
      const { processedUrl, fallbacks } = processDocumentUrl(initialUrl);
      setCurrentUrl(processedUrl);
      setFallbackUrls(fallbacks);
      setDocUrl(initialUrl);
      console.log('Initial document URL processed:', processedUrl);
    }
  }, [initialUrl]);

  // Auto-load when currentUrl changes and we're not in an error state
  useEffect(() => {
    if (currentUrl && !hasError) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentUrl, hasError]);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </CardTitle>
          <div className="flex gap-2">
            {hasError && fallbackUrls.length > 1 && currentFallbackIndex < fallbackUrls.length - 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={tryDifferentUrl}
                className="flex items-center gap-2"
              >
                Try Different View
              </Button>
            )}
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
                <p className="text-lg font-medium mb-2">Document Access Issue</p>
                <p className="text-sm text-muted-foreground mb-4">
                  This document may be private or require special permissions. 
                  {currentFallbackIndex < fallbackUrls.length - 1 && " Trying alternative view..."}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={handleLoadDocument}>
                    Try Again
                  </Button>
                  <Button variant="default" onClick={openInNewTab}>
                    Open in Google Docs
                  </Button>
                </div>
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
              
              <div className="w-full h-full">
                <iframe
                  key={`${currentUrl}-${currentFallbackIndex}`}
                  src={currentUrl}
                  className="w-full h-full border-0"
                  title={title}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  style={{ 
                    border: 'none',
                    outline: 'none',
                    background: 'white',
                    width: '100%',
                    height: '100%'
                  }}
                  allowFullScreen
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
