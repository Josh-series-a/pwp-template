
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  BookOpen, Search, ChevronLeft, ChevronRight, 
  Share, ZoomIn, ZoomOut, Printer, ExternalLink, Download,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReaderProvider } from '@/features/reader/context/ReaderContext';
import Spread from '@/features/reader/components/Spread';
import TabBar from '@/features/reader/components/TabBar';
import { useTurnPage } from '@/features/reader/hooks/useTurnPage';
import { useReader } from '@/features/reader/context/ReaderContext';
import { TOTAL_PAGES } from '@/features/reader/reader.config';

const ReaderControls = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scale, setScale] = useState(1);
  const { currentPage, isSpreadView, toggleSpreadView } = useReader();
  const { goToNextPage, goToPreviousPage, goToPage } = useTurnPage();
  const [showUI, setShowUI] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.6));
  };

  const handleShare = () => {
    navigator.share?.({
      title: 'Book Chapter',
      url: window.location.href
    }).catch(console.error);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {showUI && (
        <div className="flex items-center justify-between p-3 border-b bg-muted/20 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-serif font-medium">Prosper with Purpose</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-background/80 rounded-md px-2">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[180px] h-8"
              />
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center gap-1 bg-background/80 rounded-md px-2 py-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => goToPreviousPage()} 
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="mx-2 text-sm font-serif">Page {currentPage}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => goToNextPage()} 
                disabled={currentPage >= TOTAL_PAGES-1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="mx-1 text-sm">{Math.round(scale * 100)}%</span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {windowWidth >= 768 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSpreadView} 
                className="text-xs"
              >
                {isSpreadView ? "Single Page" : "Spread View"}
              </Button>
            )}

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={window.location.href} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" download="chapter.pdf">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowUI(false)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {!showUI && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowUI(true)}
          className="fixed top-4 right-4 bg-background/50 backdrop-blur-sm z-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      
      <div 
        className="relative flex-1 overflow-hidden"
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'center top',
        }}
      >
        <TabBar className={cn(
          "absolute left-0 top-10 z-10",
          showUI ? "pt-10" : "pt-4"
        )} />
        
        <Spread className="mt-8" />
      </div>
      
      {windowWidth < 768 && isSpreadView && (
        <div className="fixed bottom-4 left-0 right-0 mx-auto w-max bg-background/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
          <Button variant="ghost" size="sm" onClick={toggleSpreadView}>
            Switch to single page view
          </Button>
        </div>
      )}
    </>
  );
};

const Read = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#f8f5ed] dark:bg-[#252117] flex flex-col">
      <ReaderProvider initialPage={1}>
        <ReaderControls />
      </ReaderProvider>
    </div>
  );
};

export default Read;
