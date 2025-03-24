
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, FileText, BookOpen, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'there';

  // Mock data - in a real app, this would come from the database
  const lastReportDate = new Date().toLocaleDateString();
  const exercisesCompleted = 2;
  const totalExercises = 5;
  const nextSuggestion = "Defining Your Mission Statement";

  return (
    <DashboardLayout title={`Hi ${firstName}, ready to move forward today?`}>
      <div className="grid gap-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Last Report</CardDescription>
              <CardTitle className="text-lg font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2 text-primary" />
                {lastReportDate}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Exercises Completed</CardDescription>
              <CardTitle className="text-lg font-medium flex items-center">
                <Progress value={(exercisesCompleted / totalExercises) * 100} className="h-2 w-24 mr-2" />
                {exercisesCompleted}/{totalExercises}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Next Suggestion</CardDescription>
              <CardTitle className="text-lg font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                {nextSuggestion}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        
        {/* Latest Report */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Your Latest Report</CardTitle>
            <CardDescription>Business health check summary from your most recent analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Business:</h4>
                  <p className="text-sm">Acme Corporation</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Generated on:</h4>
                  <p className="text-sm">{lastReportDate}</p>
                </div>
              </div>
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Key Insights:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Strong financial position with stable growth</li>
                  <li>• Team leadership needs improvement</li>
                  <li>• Product differentiation is a strength</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">View Report</Button>
            <Button>Re-analyze</Button>
          </CardFooter>
        </Card>
        
        {/* In-Progress Exercises */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>In-Progress Exercises</CardTitle>
            <CardDescription>Continue where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Define Your Mission Statement", progress: 60 },
                { title: "Team Skills Assessment", progress: 30 },
                { title: "Future Growth Planning", progress: 15 }
              ].map((exercise, i) => (
                <div key={i} className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{exercise.title}</h3>
                    <span className="text-sm text-muted-foreground">{exercise.progress}% Complete</span>
                  </div>
                  <Progress value={exercise.progress} className="h-2 mb-4" />
                  <Button variant="outline" size="sm" className="mt-2">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Exercises</Button>
          </CardFooter>
        </Card>
        
        {/* Book Insights */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Suggested Insights from the Book</CardTitle>
            <CardDescription>Customized recommendations for your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  title: "Delegation Mastery", 
                  quote: "The art of progress is to preserve order amid change and to preserve change amid order.",
                  chapter: "Chapter 4"
                },
                { 
                  title: "Exit Planning", 
                  quote: "Begin with the end in mind. Know where you want to go before you start the journey.",
                  chapter: "Chapter 7"
                },
                { 
                  title: "Value Creation", 
                  quote: "Value creation is not just about profit, but about building something that outlasts you.",
                  chapter: "Chapter 2"
                }
              ].map((insight, i) => (
                <Card key={i} className="overflow-hidden border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                    <CardDescription className="text-xs">{insight.chapter}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm italic pt-0 pb-2">
                    "{insight.quote}"
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="w-full justify-start px-0">
                      Read More <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Explore Book Insights</Button>
          </CardFooter>
        </Card>
        
        {/* Call to Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Want a deeper dive?</CardTitle>
              <CardDescription className="text-primary-foreground/90">
                Book a one-on-one coaching session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90">
                Get personalized guidance and actionable advice tailored to your specific business challenges.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary">Book Coaching Session</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Share Your Progress</CardTitle>
              <CardDescription>
                Invite your advisor to review this report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get valuable feedback from your trusted business advisor by sharing your latest report.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Invite Advisor</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
