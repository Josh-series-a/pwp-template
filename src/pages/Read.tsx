
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { BookOpen, Quote } from 'lucide-react';

const Read = () => {
  const [activeTab, setActiveTab] = useState('1');
  
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

  return (
    <DashboardLayout title="Read">
      <div className="space-y-6">
        <div className="max-w-3xl">
          <p className="text-muted-foreground mb-6">
            Read through the book content chapter by chapter. Take notes and highlight key concepts that resonate with your business journey.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/40">
              <div className="flex items-center gap-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Book Content</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full justify-start px-6 pt-4 bg-background border-b">
                  {chapters.map((chapter) => (
                    <TabsTrigger
                      key={chapter.id}
                      value={chapter.id.toString()}
                      className={cn(
                        "data-[state=active]:bg-muted",
                        "rounded-none border-b-2 border-transparent",
                        "data-[state=active]:border-primary"
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
                    className="p-6 space-y-6"
                  >
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold">{chapter.title}</h2>
                      <p className="text-sm text-muted-foreground">Theme: {chapter.theme}</p>
                      
                      <div className="bg-muted p-4 rounded-md flex gap-3 my-4">
                        <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <p className="text-sm italic">{chapter.quote}</p>
                      </div>

                      <div className="prose max-w-none">
                        <p className="whitespace-pre-line">{chapter.content}</p>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Read;
