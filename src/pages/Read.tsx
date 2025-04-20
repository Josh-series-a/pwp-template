import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BookOpen, Search, ChevronLeft, ChevronRight, X,
  Share, ZoomIn, ZoomOut, Printer, ExternalLink, Download,
  Bookmark, Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageTransition from '@/components/PageTransition';
import ListenDialog from '@/components/ListenDialog';
import bookChapters from '@/data/bookChapters';
import { useToast } from '@/hooks/use-toast';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Read = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [scale, setScale] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSpreadView, setIsSpreadView] = useState(true);
  const [showUI, setShowUI] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isPageTurning, setIsPageTurning] = useState(false);
  const [pageDirection, setPageDirection] = useState<'next' | 'prev'>('next');
  const [listenDialogOpen, setListenDialogOpen] = useState(false);
  const [isSkipToPageOpen, setIsSkipToPageOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 1024) {
      setIsSpreadView(false);
    }
  }, [windowWidth]);

  const chapters = bookChapters;
  
  const currentChapter = chapters.find(chapter => chapter.id === currentPage) || chapters[0];

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPageDirection('prev');
      setIsPageTurning(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsPageTurning(false);
      }, 300);
    }
  };

  const handleNextPage = () => {
    if (currentPage < chapters.length) {
      setPageDirection('next');
      setIsPageTurning(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsPageTurning(false);
      }, 300);
    }
  };

  const toggleUI = () => {
    setShowUI(!showUI);
  };

  const handleZoomIn = () => {
    if (scale < 1.5) {
      setScale(scale + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (scale > 0.5) {
      setScale(scale - 0.1);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this book with others",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your book download will begin shortly",
    });
  };

  const handleBookmark = () => {
    toast({
      title: "Page bookmarked",
      description: `You've bookmarked Chapter ${currentPage}`,
    });
  };

  const handleOpenListenDialog = () => {
    setListenDialogOpen(true);
  };

  const handleCloseListenDialog = () => {
    setListenDialogOpen(false);
  };

  const handleSkipToPage = (pageNumber: string) => {
    const newPage = parseInt(pageNumber, 10);
    if (newPage >= 1 && newPage <= chapters.length) {
      setPageDirection(newPage > currentPage ? 'next' : 'prev');
      setIsPageTurning(true);
      setTimeout(() => {
        setCurrentPage(newPage);
        setIsPageTurning(false);
        setIsSkipToPageOpen(false);
      }, 300);
    }
  };

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col transition-all duration-300 ease-in-out bg-[#FBF7F4]",
        !showUI && "cursor-none"
      )}
      onClick={showUI ? undefined : toggleUI}
      style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }}
    >
      {showUI && (
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-sm">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')} 
              className="mr-2"
              aria-label="Back to dashboard"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Prosper with Purpose</h1>
          </div>
          
          <div className="flex items-center">
            <div className="relative mr-2 hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search in book..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-40 lg:w-64"
              />
            </div>
            
            <Drawer open={isSkipToPageOpen} onOpenChange={setIsSkipToPageOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <BookOpen className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Skip to Page</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4">
                    <Select onValueChange={handleSkipToPage} value={currentPage.toString()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a page" />
                      </SelectTrigger>
                      <SelectContent>
                        {chapters.map((chapter, index) => (
                          <SelectItem key={chapter.id} value={chapter.id.toString()}>
                            Chapter {chapter.id}: {chapter.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DrawerFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsSkipToPageOpen(false)}
                    >
                      Cancel
                    </Button>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
            
            <Button variant="ghost" size="icon" onClick={handleShare} className="hidden sm:flex">
              <Share className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="hidden sm:flex">
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="hidden sm:flex">
              <ZoomOut className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handlePrint} className="hidden sm:flex">
              <Printer className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownload} className="hidden sm:flex">
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleBookmark} className="hidden sm:flex">
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleOpenListenDialog}>
              <Headphones className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleUI}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 md:px-8 lg:px-16">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg min-h-[70vh] overflow-hidden">
          <PageTransition 
            isAnimating={isPageTurning} 
            direction={pageDirection}
            pageNumber={currentPage}
            totalPages={chapters.length}
          >
            <div className="p-6 md:p-8 lg:p-12 book-page">
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-center mb-2">{currentChapter.title}</h2>
              <p className="text-center text-muted-foreground italic mb-8">Theme: {currentChapter.theme}</p>
              
              <div className="prose prose-slate max-w-none">
                {currentChapter.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('🔎Case Study')) {
                    return (
                      <div key={index} className="bg-slate-50 p-4 my-6 border-l-4 border-blue-500 rounded">
                        <h4 className="font-bold text-blue-600 mb-2">Case Study</h4>
                        {paragraph.replace('🔎Case Study', '').trim()}
                      </div>
                    );
                  } else if (paragraph.startsWith('⚠️ Warning')) {
                    return (
                      <div key={index} className="bg-amber-50 p-4 my-6 border-l-4 border-amber-500 rounded">
                        <h4 className="font-bold text-amber-600 mb-2">Warning</h4>
                        {paragraph.replace('⚠️ Warning', '').trim()}
                      </div>
                    );
                  } else if (paragraph.startsWith('⚙️Resource')) {
                    return (
                      <div key={index} className="bg-emerald-50 p-4 my-6 border-l-4 border-emerald-500 rounded">
                        <h4 className="font-bold text-emerald-600 mb-2">Resources</h4>
                        {paragraph.replace('⚙️Resource', '').trim()}
                      </div>
                    );
                  } else if (paragraph.startsWith('Exercise')) {
                    return (
                      <div key={index} className="bg-purple-50 p-4 my-6 border-l-4 border-purple-500 rounded">
                        <h4 className="font-bold text-purple-600 mb-2">{paragraph.split(':')[0]}</h4>
                        {paragraph.includes(':') ? paragraph.split(':').slice(1).join(':') : ''}
                      </div>
                    );
                  } else if (paragraph.startsWith('Figure')) {
                    return (
                      <div key={index} className="text-center my-6 italic text-sm text-muted-foreground">
                        {paragraph}
                      </div>
                    );
                  } else if (paragraph.startsWith('💡Tip')) {
                    return (
                      <div key={index} className="bg-indigo-50 p-4 my-6 border-l-4 border-indigo-500 rounded">
                        <h4 className="font-bold text-indigo-600 mb-2">{paragraph.split(':')[0].replace('💡', '')}</h4>
                        {paragraph.includes(':') ? paragraph.split(':').slice(1).join(':') : ''}
                      </div>
                    );
                  } else {
                    return <p key={index} className="mb-4">{paragraph}</p>;
                  }
                })}
              </div>

              <div className="mt-12 pt-6 border-t border-muted">
                <blockquote className="italic text-lg text-center">
                  "{currentChapter.quote}"
                </blockquote>
                <p className="text-center mt-6 text-muted-foreground font-medium">
                  {currentChapter.summary}
                </p>
              </div>
            </div>
          </PageTransition>
        </div>

        <div className="w-full max-w-4xl flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Chapter
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage >= chapters.length}
            className="flex items-center"
          >
            Next Chapter
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <ListenDialog 
        isOpen={listenDialogOpen} 
        onClose={handleCloseListenDialog}
        chapterId={currentChapter.id}
        chapterTitle={currentChapter.title}
      />
    </div>
  );
};

export default Read;
