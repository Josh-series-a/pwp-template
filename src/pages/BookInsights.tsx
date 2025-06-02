import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import ListenDialog from '@/components/ListenDialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ArrowRight,
  Headphones,
  Star,
  Quote,
  Brain,
  Target,
  TrendingUp
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import bookChapters from '@/data/bookChapters';

const BookInsights = () => {
  const navigate = useNavigate();
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
        return { 
          label: "Highly Relevant to You", 
          color: "bg-emerald-100 text-emerald-800 border-emerald-200", 
          stars: 3,
          icon: TrendingUp
        };
      case "medium":
        return { 
          label: "Moderately Relevant", 
          color: "bg-blue-100 text-blue-800 border-blue-200", 
          stars: 2,
          icon: Target
        };
      case "low":
        return { 
          label: "Good to Know", 
          color: "bg-gray-100 text-gray-800 border-gray-200", 
          stars: 1,
          icon: Brain
        };
      default:
        return { 
          label: "Relevance Unknown", 
          color: "bg-gray-100 text-gray-800 border-gray-200", 
          stars: 0,
          icon: Brain
        };
    }
  };

  return (
    <DashboardLayout title="Book Insights">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative px-8 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                  Personalized Content
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Personalized Business Journey
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Discover key insights and actionable strategies tailored to your business context. 
                Each chapter is ranked by relevance to help you focus on what matters most for your growth.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {availableChapters.filter(c => getRelevanceForChapter(c.id) === "high").length}
                  </p>
                  <p className="text-sm text-emerald-600 font-medium">High Priority Chapters</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">{availableChapters.length}</p>
                  <p className="text-sm text-blue-600 font-medium">Available Chapters</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">
                    {availableChapters.reduce((acc, chapter) => {
                      const exercises = chapter.content
                        .split('\n\n')
                        .filter(p => p.startsWith('Exercise'));
                      return acc + exercises.length;
                    }, 0)}
                  </p>
                  <p className="text-sm text-purple-600 font-medium">Total Exercises</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Chapters Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Chapter Insights
            </h3>
            <Badge variant="outline" className="text-sm">
              {availableChapters.length} chapters available
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableChapters.map((chapter) => {
              const relevance = getRelevanceLabel(getRelevanceForChapter(chapter.id));
              const exercises = chapter.content
                .split('\n\n')
                .filter(p => p.startsWith('Exercise'))
                .map(e => e.split(':')[0].trim());
              
              return (
                <Card key={chapter.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <relevance.icon className="h-4 w-4" />
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-medium border ${relevance.color}`}
                        >
                          {relevance.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(relevance.stars)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                        {[...Array(3 - relevance.stars)].map((_, i) => (
                          <Star key={i + relevance.stars} className="h-4 w-4 text-gray-300" />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                        {chapter.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        <span className="font-medium">Chapter {chapter.id}</span> • {chapter.theme}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{chapter.summary}</p>
                    
                    <div className="relative">
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary/20 to-primary/10 rounded-full"></div>
                      <div className="pl-6 pr-4 py-3 bg-gray-50/50 rounded-r-lg border-l-0">
                        <div className="flex gap-3">
                          <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm italic text-gray-700 leading-relaxed">
                            "{chapter.quote}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-4 pt-4">
                    {exercises.length > 0 && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="exercises" className="border-0">
                          <AccordionTrigger className="text-sm font-medium hover:no-underline py-2 px-3 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-primary" />
                              Related Exercises ({exercises.length})
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2">
                            <div className="space-y-2 px-3">
                              {exercises.map((exercise, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-gray-50/50">
                                  <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                                  <span className="text-sm font-medium text-gray-700">{exercise}</span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                    
                    <div className="flex w-full gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 group-hover:border-primary/50 transition-colors" 
                        asChild
                      >
                        <Link to={`/dashboard/read?chapter=${chapter.id}`}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Read
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 group-hover:border-primary/50 transition-colors"
                        onClick={() => {
                          setActiveChapter(chapter.id);
                          setIsListenDialogOpen(true);
                        }}
                      >
                        <Headphones className="mr-2 h-4 w-4" />
                        Listen
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm"
                        onClick={() => navigate('/dashboard/exercises')}
                      >
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
