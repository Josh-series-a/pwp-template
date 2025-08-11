
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, FileText, AlertCircle, Loader2, Share, Link, Download, ArrowLeft, Linkedin, Facebook, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip } from '@/components/ui/tooltip';

interface CustomDocumentViewerProps {
  docUrl?: string;
  title?: string;
  height?: string;
  className?: string;
  showUrlInput?: boolean;
  customHeaderButtons?: React.ReactNode;
  onBackClick?: () => void;
}

const CustomDocumentViewer: React.FC<CustomDocumentViewerProps> = ({
  docUrl: initialUrl = '',
  title = 'Document Preview',
  height = '600px',
  className,
  showUrlInput = true,
  customHeaderButtons,
  onBackClick
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
      // Primary view-only URL (no editing interface)
      `https://docs.google.com/document/d/${docId}/preview`,
      // Embedded viewer with minimal UI
      `https://docs.google.com/document/d/${docId}/pub?embedded=true`,
      // Alternative embed format
      `https://docs.google.com/viewer?url=https://docs.google.com/document/d/${docId}/export?format=pdf&embedded=true`,
      // PDF export embedded
      `https://drive.google.com/file/d/${docId}/preview`
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
      }, 2000);
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareToLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(docUrl)}`;
    window.open(shareUrl, '_blank');
  };

  const shareToFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(docUrl)}`;
    window.open(shareUrl, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this document: ${title}`);
    const body = encodeURIComponent(`I wanted to share this document with you: ${docUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const downloadDocument = () => {
    if (docUrl) {
      // Try to extract document ID and create download link
      const docId = getDocumentIdFromUrl(docUrl);
      if (docId) {
        const downloadUrl = `https://docs.google.com/document/d/${docId}/export?format=pdf`;
        window.open(downloadUrl, '_blank');
      } else {
        window.open(docUrl, '_blank');
      }
    }
  };

  useEffect(() => {
    if (initialUrl) {
      const { processedUrl, fallbacks } = processDocumentUrl(initialUrl);
      setCurrentUrl(processedUrl);
      setFallbackUrls(fallbacks);
      setDocUrl(initialUrl);
    }
  }, [initialUrl]);

  return (
    <Card className={cn("w-full flex flex-col", className)}>
      <CardHeader className="pb-4 flex-shrink-0">
        {/* New comprehensive header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBackClick && (
              <Button variant="ghost" size="sm" onClick={onBackClick}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{title}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* External link button */}
            <Tooltip content="Open in new tab">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openInNewTab}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Tooltip>

            {/* Share dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={shareToLinkedIn} className="cursor-pointer">
                  <Linkedin className="h-4 w-4 mr-2" />
                  Share on LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer">
                  <Facebook className="h-4 w-4 mr-2" />
                  Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareViaEmail} className="cursor-pointer">
                  <Mail className="h-4 w-4 mr-2" />
                  Share via Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Copy link button */}
            <Tooltip content="Copy document link">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(docUrl)}
              >
                <Link className="h-4 w-4" />
              </Button>
            </Tooltip>

            {/* Download button */}
            <Tooltip content="Download document">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadDocument}
              >
                <Download className="h-4 w-4" />
              </Button>
            </Tooltip>

            {/* Custom header buttons (legacy support) */}
            {customHeaderButtons && customHeaderButtons}
            
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
      
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <div 
          className="border-t bg-white flex-1 min-h-0"
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
            <div className="relative w-full h-full">
              {isLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading document...</p>
                  </div>
                </div>
              )}
              
              {currentUrl && (
                <iframe
                  key={currentUrl}
                  src={currentUrl}
                  className="w-full h-full border-0"
                  title={title}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  allowFullScreen
                  style={{ minHeight: '100%' }}
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomDocumentViewer;
