
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, FileText, BookOpen, ArrowRight, BarChart3, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'there';

  // Mock data - in a real app, this would come from the database
  const lastReportDate = new Date().toLocaleDateString();
  const completedSteps = 3;
  const totalSteps = 5;
  const completionPercentage = (completedSteps / totalSteps) * 100;

  return (
    <DashboardLayout title={`Welcome back, ${firstName}`}>
      <div className="grid gap-6">
        {/* Business Overview Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Business Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardDescription className="text-blue-700">Revenue</CardDescription>
                <CardTitle className="text-2xl font-bold flex items-center text-blue-900">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  $24,500
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardDescription className="text-green-700">New Customers</CardDescription>
                <CardTitle className="text-2xl font-bold flex items-center text-green-900">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  18
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700">+5 from last month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-2">
                <CardDescription className="text-purple-700">Reports Generated</CardDescription>
                <CardTitle className="text-2xl font-bold flex items-center text-purple-900">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  7
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-700">Last: {lastReportDate}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardHeader className="pb-2">
                <CardDescription className="text-amber-700">Action Items</CardDescription>
                <CardTitle className="text-2xl font-bold flex items-center text-amber-900">
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
                  4
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-700">2 high priority</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Latest Report Summary */}
        <Card className="shadow-md">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Latest Business Analysis</CardTitle>
                <CardDescription>Summary from your most recent report</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/reports">View All Reports</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground mb-2">Business Health Score</span>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold mr-2">72</span>
                    <span className="text-sm text-green-600 font-medium">/100</span>
                  </div>
                  <Progress value={72} className="h-2 mt-2" />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground mb-2">Implementation Progress</span>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold mr-2">{completedSteps}</span>
                    <span className="text-sm text-muted-foreground font-medium">/{totalSteps} Steps</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2 mt-2" />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground mb-2">Next Review</span>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <span className="text-base font-medium">May 15, 2025</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Key Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-background/50">
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Strengths</CardTitle>
                    </CardHeader>
                    <CardContent className="py-1">
                      <ul className="text-sm space-y-1.5">
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          Strong financial position with stable cash flow
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          Excellent customer retention rate of 87%
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          Unique product differentiation in the market
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-background/50">
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent className="py-1">
                      <ul className="text-sm space-y-1.5">
                        <li className="flex items-start">
                          <span className="text-amber-600 mr-2">•</span>
                          Team leadership development needed
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-600 mr-2">•</span>
                          Marketing strategy requires refinement
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-600 mr-2">•</span>
                          Operational efficiency could be optimized
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/30 flex justify-between">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastReportDate}
            </div>
            <Button size="sm">
              View Full Report <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Current Focus & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Current Focus</CardTitle>
              <CardDescription>
                Priority action items based on your business analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Define team responsibilities", priority: "High", progress: 45 },
                  { title: "Update marketing materials", priority: "Medium", progress: 70 },
                  { title: "Review vendor contracts", priority: "High", progress: 20 },
                  { title: "Update financial forecast", priority: "Medium", progress: 60 },
                ].map((item, i) => (
                  <div key={i} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{item.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.priority === "High" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2 mb-2" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Manage Action Items</Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Expert Recommendations</CardTitle>
              <CardDescription>
                Based on the book "Prosper with Purpose"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    title: "Leadership Development", 
                    description: "Create a structured mentoring program to develop your management team.",
                    chapter: "Ch. 4: Building Effective Teams"
                  },
                  { 
                    title: "Financial Planning", 
                    description: "Implement a rolling 12-month cash flow forecast to improve decision making.",
                    chapter: "Ch. 7: Financial Mastery"
                  },
                  { 
                    title: "Customer Experience", 
                    description: "Map your customer journey to identify and eliminate pain points.",
                    chapter: "Ch. 3: Customer-Centric Growth"
                  },
                ].map((item, i) => (
                  <div key={i} className="border rounded-md p-4">
                    <h3 className="font-medium mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex items-center text-xs text-primary">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {item.chapter}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Recommendations</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Call to Action */}
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle>Ready to take your business to the next level?</CardTitle>
            <CardDescription className="text-primary-foreground/90">
              Schedule a personalized coaching session with our experts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90">
              Get targeted guidance on implementing your business recommendations and developing a strategic roadmap for growth.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" disabled>Book a Coaching Session</Button>
            <Button variant="outline" className="ml-2 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              Learn More
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
