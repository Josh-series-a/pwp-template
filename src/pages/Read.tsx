import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  BookOpen, Search, ChevronLeft, ChevronRight, 
  Share, ZoomIn, ZoomOut, Printer, ExternalLink, Download,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageTransition from '@/components/PageTransition';

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

  const chapters = [
    {
      id: 1,
      title: "Mission and Vision",
      theme: "Planning",
      content: `A clear mission and vision are the foundation of any successful business. Your mission statement articulates why your business exists and what problem it solves for customers. Your vision statement paints a picture of where you want your business to be in the future.

When crafting these statements:
- Keep them concise and memorable
- Focus on the value you provide
- Make them inspiring yet achievable
- Ensure they align with your values

Your business's mission and vision should guide every major decision you make. They act as a north star, helping you stay focused on what matters most.`,
      summary: "Establishing a clear mission and vision is fundamental to building a sustainable business that outlasts its founder.",
      quote: "A business without a mission is like a ship without a rudder - it may float, but it won't go anywhere meaningful."
    },
    {
      id: 2,
      title: "Team Building",
      theme: "People",
      content: `Building and maintaining a strong team is crucial for business success. Your team members are the ones who will help turn your vision into reality. Focus on:

1. Hiring for Culture Fit
- Look for people who share your values
- Assess both technical skills and soft skills
- Consider how they'll contribute to team dynamics

2. Professional Development
- Invest in training and education
- Create growth opportunities
- Foster a learning environment

3. Team Dynamics
- Encourage open communication
- Build trust through transparency
- Celebrate successes together`,
      summary: "The quality of your team will determine the ceiling of your business growth. Learn how to hire, develop and retain top talent.",
      quote: "Your business will never outgrow the quality of your team. Invest in people who share your values but complement your weaknesses."
    },
    {
      id: 3,
      title: "Financial Foundations",
      theme: "Profit",
      content: `Strong financial management is essential for business sustainability. Key areas to focus on:

1. Cash Flow Management
- Monitor incoming and outgoing cash
- Maintain emergency reserves
- Plan for seasonal fluctuations

2. Profit Margins
- Understand your cost structure
- Price products/services appropriately
- Look for efficiency improvements

3. Financial Planning
- Set clear financial goals
- Create detailed budgets
- Review and adjust regularly`,
      summary: "Building robust financial systems is essential for making informed decisions and ensuring long-term sustainability.",
      quote: "Profit isn't just a goal - it's the oxygen that keeps your business alive. Monitor it as closely as your own breathing."
    }
  ];

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

  const toggleFullscreen = () => {
    setShowUI(!showUI);
  };

  const toggleView = () => {
    setIsSpreadView(!isSpreadView);
  };

  const getChapterByPage = (page) => {
    return chapters[Math.min(page - 1, chapters.length - 1)];
  };

  const currentChapter = getChapterByPage(currentPage);

  const handlePageChange = (direction: 'next' | 'prev') => {
    setPageDirection(direction);
    setIsPageTurning(true);
    
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentPage(prev => Math.min(prev + 1, chapters.length));
      } else {
        setCurrentPage(prev => Math.max(prev - 1, 1));
      }
      setTimeout(() => setIsPageTurning(false), 50);
    }, 300);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#f8f5ed] dark:bg-[#252117] flex flex-col">
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
              <Button variant="ghost" size="icon" onClick={() => handlePageChange('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="mx-2 text-sm font-serif">Page {currentPage}</span>
              <Button variant="ghost" size="icon" onClick={() => handlePageChange('next')}>
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
                onClick={toggleView} 
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
              <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                {showUI ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={cn(
        "flex-1 flex justify-center overflow-hidden",
        "bg-[#f8f5ed] dark:bg-[#252117]"
      )}>
        <div className={cn(
          "flex flex-col gap-2 pr-2 overflow-y-auto",
          showUI ? "pt-10" : "pt-4"
        )}>
          {chapters.map(chapter => (
            <Button
              key={chapter.id}
              variant="ghost"
              className={cn(
                "px-2 py-6 rounded-r-md border-r-4 shadow-md relative w-8 h-16",
                activeTab === chapter.id.toString() 
                  ? "border-primary bg-primary/10" 
                  : "border-muted bg-background/80"
              )}
              onClick={() => {
                setActiveTab(chapter.id.toString());
                setCurrentPage(chapter.id);
              }}
            >
              <span className="absolute -rotate-90 whitespace-nowrap font-serif text-xs">
                Ch {chapter.id}
              </span>
            </Button>
          ))}
        </div>
        
        <PageTransition 
          isAnimating={isPageTurning} 
          direction={pageDirection}
          pageNumber={currentPage}
          totalPages={chapters.length}
        >
          <div 
            className={cn(
              "relative overflow-hidden book-container w-full max-w-[1400px]",
              isSpreadView ? "flex" : "block"
            )}
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: 'center top',
            }}
          >
            {isSpreadView && (
              <div className="book-page left-page min-w-[600px] max-w-[600px] h-[840px] bg-[#f8f5ed] dark:bg-[#252117] shadow-[inset_-25px_0_25px_-20px_rgba(0,0,0,0.3)] p-12 overflow-y-auto">
                <div className="h-full flex flex-col">
                  <h2 className="text-xl font-serif mb-6 text-primary">Table of Contents</h2>
                  <div className="space-y-4">
                    {chapters.map(chapter => (
                      <div 
                        key={chapter.id} 
                        className={cn(
                          "cursor-pointer p-3 border-l-2 transition-colors",
                          activeTab === chapter.id.toString() 
                            ? "border-primary bg-primary/5" 
                            : "border-muted hover:border-primary/50"
                        )}
                        onClick={() => {
                          setActiveTab(chapter.id.toString());
                          setCurrentPage(chapter.id);
                        }}
                      >
                        <h3 className="font-serif text-lg">{chapter.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{chapter.summary}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-8 border-t border-muted/30">
                    <h3 className="font-serif text-sm mb-2">Notes</h3>
                    <div className="bg-[#f2efe6] dark:bg-[#2a271e] p-3 rounded min-h-[120px] text-muted-foreground italic text-sm">
                      Click to add personal notes...
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={cn(
              "book-page right-page min-w-[600px] max-w-[600px] h-[840px] bg-[#f8f5ed] dark:bg-[#252117] p-12 overflow-y-auto",
              isSpreadView 
                ? "shadow-[inset_25px_0_25px_-20px_rgba(0,0,0,0.3)]" 
                : "shadow-[0_5px_25px_-5px_rgba(0,0,0,0.3)]"
            )}>
              <div>
                <h1 className="text-3xl font-serif mb-2 font-bold">{currentChapter.title}</h1>
                <p className="text-sm text-muted-foreground">Theme: {currentChapter.theme}</p>
                
                <div className="my-6 pl-6 border-l-4 border-primary/20">
                  <p className="text-lg italic text-muted-foreground font-serif">{currentChapter.quote}</p>
                </div>

                <div className="prose prose-slate prose-headings:font-serif prose-p:text-lg prose-p:leading-relaxed dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line text-lg font-[Georgia] leading-relaxed">{currentChapter.content}</p>
                </div>

                <div className="flex justify-between mt-12 text-sm text-muted-foreground">
                  <div>
                    {currentPage > 1 && 
                      <button onClick={() => handlePageChange('prev')} className="flex items-center">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                      </button>
                    }
                  </div>
                  <div>
                    {currentPage < chapters.length &&
                      <button onClick={() => handlePageChange('next')} className="flex items-center">
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageTransition>

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
      </div>

      {windowWidth < 768 && isSpreadView && (
        <div className="fixed bottom-4 left-0 right-0 mx-auto w-max bg-background/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
          <Button variant="ghost" size="sm" onClick={() => setIsSpreadView(false)}>
            Switch to single page view
          </Button>
        </div>
      )}
    </div>
  );
};

export default Read;
