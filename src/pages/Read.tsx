
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { BookOpen, Search, SkipBack, SkipForward, Share, ZoomIn, ZoomOut, Printer, ExternalLink, Download } from 'lucide-react';

const Read = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [scale, setScale] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for book chapters (using the same data structure as BookInsights)
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

  return (
    <div className="fixed inset-0 bg-background">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/40">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-semibold">Book Reader</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-background rounded-md px-2">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[200px]"
            />
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-1 bg-background rounded-md px-2 py-1">
            <Button variant="ghost" size="icon" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <span className="mx-2 text-sm">Page {currentPage}</span>
            <Button variant="ghost" size="icon" onClick={() => setCurrentPage(prev => prev + 1)}>
              <SkipForward className="h-4 w-4" />
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
          </div>
        </div>
      </div>

      {/* Book Content */}
      <div className="h-[calc(100vh-73px)] overflow-auto bg-muted/10 p-8">
        <div 
          className="w-full max-w-6xl h-full mx-auto bg-background rounded-lg shadow-lg p-12 overflow-y-auto"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start mb-8">
              {chapters.map((chapter) => (
                <TabsTrigger
                  key={chapter.id}
                  value={chapter.id.toString()}
                  className={cn(
                    "data-[state=active]:bg-primary/10",
                    "data-[state=active]:text-primary"
                  )}
                >
                  Chapter {chapter.id}
                </TabsTrigger>
              ))}
            </TabsList>

            {chapters.map((chapter) => (
              <TabsContent
                key={chapter.id}
                value={chapter.id.toString()}
                className="space-y-6 [&_p]:leading-7"
              >
                <div className="space-y-4">
                  <h1 className="text-4xl font-serif mb-2">{chapter.title}</h1>
                  <p className="text-sm text-muted-foreground">Theme: {chapter.theme}</p>
                  
                  <div className="my-6 pl-6 border-l-4 border-primary/20">
                    <p className="text-lg italic text-muted-foreground">{chapter.quote}</p>
                  </div>

                  <div className="prose prose-gray max-w-none">
                    <p className="whitespace-pre-line text-lg">{chapter.content}</p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Read;
