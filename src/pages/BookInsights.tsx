import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
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

const BookInsights = () => {
  // Mock data for book chapters
  const chapters = [
    {
      id: 1,
      title: "Mission and Vision",
      theme: "Planning",
      summary: "Establishing a clear mission and vision is fundamental to building a sustainable business that outlasts its founder.",
      relevance: "high",
      quote: "A business without a mission is like a ship without a rudder - it may float, but it won't go anywhere meaningful.",
      exercises: ["Define Your Mission Statement", "Vision Board Creation"]
    },
    {
      id: 2,
      title: "Team Building",
      theme: "People",
      summary: "The quality of your team will determine the ceiling of your business growth. Learn how to hire, develop and retain top talent.",
      relevance: "medium",
      quote: "Your business will never outgrow the quality of your team. Invest in people who share your values but complement your weaknesses.",
      exercises: ["Team Skills Assessment", "Leadership Development Plan"]
    },
    {
      id: 3,
      title: "Financial Foundations",
      theme: "Profit",
      summary: "Building robust financial systems is essential for making informed decisions and ensuring long-term sustainability.",
      relevance: "high",
      quote: "Profit isn't just a goal - it's the oxygen that keeps your business alive. Monitor it as closely as your own breathing.",
      exercises: ["Profit Margin Analysis", "Cash Flow Projection"]
    },
    {
      id: 4,
      title: "Delegation Mastery",
      theme: "People",
      summary: "Learning to effectively delegate is the key to scaling your business beyond your personal capacity.",
      relevance: "high",
      quote: "The moment you become the bottleneck in your business is the moment growth stops. Mastering delegation is mastering growth.",
      exercises: ["Delegation Audit", "Systems Documentation"]
    },
    {
      id: 5,
      title: "Customer Experience",
      theme: "Planning",
      summary: "Designing an exceptional customer journey will create loyal advocates for your business.",
      relevance: "medium",
      quote: "Your customer doesn't care about your internal processes - they care about how you make them feel at every touchpoint.",
      exercises: ["Customer Journey Mapping", "Customer Persona Development"]
    },
    {
      id: 6,
      title: "Exit Planning",
      theme: "Planning",
      summary: "Building with the end in mind creates more options and increases the value of your business.",
      relevance: "low",
      quote: "The ultimate test of your business isn't how well it works when you're there, but how well it works when you're not.",
      exercises: ["Future Growth Planning", "Value Builder Assessment"]
    },
  ];

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
          {chapters.map((chapter) => {
            const relevance = getRelevanceLabel(chapter.relevance);
            
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
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="exercises">
                      <AccordionTrigger className="text-sm">
                        Related Exercises
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {chapter.exercises.map((exercise, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-primary"></span>
                              <span className="text-sm">{exercise}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="flex w-full gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      asChild
                    >
                      <Link to="/dashboard/read">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Read
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1">
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
    </DashboardLayout>
  );
};

export default BookInsights;
