
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import ListenDialog from '@/components/ListenDialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  ArrowRight,
  Headphones,
  Star,
  Quote
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import bookChapters from '@/data/bookChapters';

const BookInsights = () => {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [isListenDialogOpen, setIsListenDialogOpen] = useState(false);

  // Only show chapters that have actual content (available for reading)
  const availableChapters = bookChapters.filter(chapter => 
    chapter.content && chapter.content.trim().length > 0
  );

  // Map relevance based on chapter positions
  const getRelevanceForChapter = (chapterId: number) => {
    if (chapterId <= 3) return "high";
    if (chapterId <= 6) return "medium";
    return "low";
  };

  const getRelevanceLabel = (relevance: string) => {
    switch (relevance) {
      case "high":
        return { label: "Highly Relevant to You", color: "bg-green-100 text-green-800", stars: 3 };
      case "medium":
        return { label: "Moderately Relevant", color: "bg-blue-100 text-blue-800", stars: 2 };
      case "low":
        return { label: "Good to Know", color: "bg-gray-100 text-gray-800", stars: 1 };
      default:
        return { label: "Relevance Unknown", color: "bg-gray-100 text-gray-800", stars: 0 };
    }
  };

  return (
    <DashboardLayout title="Book Insights">
      <div className="space-y-6">
        <div className="max-w-3xl">
          <p className="text-muted-foreground mb-6">
            Dynamic summary of book content, based on your business context. Explore key concepts and start related exercises.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableChapters.map((chapter) => {
            const relevance = getRelevanceLabel(getRelevanceForChapter(chapter.id));
            const exercises = chapter.content
              .split('\n\n')
              .filter(p => p.startsWith('Exercise'))
              .map(e => e.split(':')[0].trim());
            
            return (
              <Card key={chapter.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{chapter.title}</CardTitle>
                      <CardDescription>Chapter {chapter.id} • {chapter.theme}</CardDescription>
                    </div>
                    <div className="flex">
                      {[...Array(relevance.stars)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                      {[...Array(3 - relevance.stars)].map((_, i) => (
                        <Star key={i + relevance.stars} className="h-4 w-4 text-muted-foreground" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${relevance.color}`}>
                        {relevance.label}
                      </span>
                    </div>
                    <p className="text-sm">{chapter.summary}</p>
                    <div className="bg-muted p-3 rounded-md flex gap-3">
                      <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-sm italic">"{chapter.quote}"</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  {exercises.length > 0 && (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="exercises">
                        <AccordionTrigger className="text-sm">
                          Related Exercises
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {exercises.map((exercise, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-primary"></span>
                                <span className="text-sm">{exercise}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                  
                  <div className="flex w-full gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      asChild
                    >
                      <Link to={`/dashboard/read?chapter=${chapter.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Read
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setActiveChapter(chapter.id);
                        setIsListenDialogOpen(true);
                      }}
                    >
                      <Headphones className="mr-2 h-4 w-4" />
                      Listen
                    </Button>
                    <Button className="flex-1">
                      Start Exercise
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {activeChapter && (
        <ListenDialog
          isOpen={isListenDialogOpen}
          onClose={() => {
            setIsListenDialogOpen(false);
            setActiveChapter(null);
          }}
          chapterId={activeChapter}
          chapterTitle={availableChapters.find(c => c.id === activeChapter)?.title || ''}
        />
      )}
    </DashboardLayout>
  );
};

export default BookInsights;
