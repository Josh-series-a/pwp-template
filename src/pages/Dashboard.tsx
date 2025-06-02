
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, FileText, BookOpen, ArrowRight, BarChart3, TrendingUp, Users, AlertCircle, Book, Dumbbell, Package, Eye, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { apiService } from '@/utils/apiService';

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'there';
  
  // Real data states
  const [reports, setReports] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestReport, setLatestReport] = useState<any>(null);

  // Fetch real data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch reports
        const { data: reportsData } = await supabase
          .from('reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (reportsData) {
          setReports(reportsData);
          setLatestReport(reportsData[0] || null);
        }

        // Fetch packages
        const { data: packagesData } = await supabase
          .from('packages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (packagesData) {
          setPackages(packagesData);
        }

        // Fetch documents
        const documentsData = await apiService.getDocuments();
        setDocuments(documentsData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Calculate metrics from real data
  const totalReports = reports.length;
  const recentReports = reports.filter(report => {
    const reportDate = new Date(report.created_at);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return reportDate >= oneMonthAgo;
  }).length;

  const lastReportDate = latestReport ? new Date(latestReport.created_at).toLocaleDateString() : 'No reports yet';
  
  // Calculate business health score from latest report
  const businessHealthScore = latestReport?.overall_score || 0;
  
  // Calculate completion progress (example: based on report status)
  const completedReports = reports.filter(r => r.status === 'Completed').length;
  const totalReportsForProgress = Math.max(reports.length, 1);
  const completionPercentage = (completedReports / totalReportsForProgress) * 100;

  // Reading progress (placeholder - would need book reading data)
  const readingProgress = 65; // This would come from actual reading data
  
  // Exercise completion (placeholder - would need exercise data)
  const completedExercises = 8;
  const totalExercises = 15;
  const exerciseProgress = (completedExercises / totalExercises) * 100;

  if (isLoading) {
    return (
      <DashboardLayout title={`Welcome back, ${firstName}`}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Welcome back, ${firstName}`}>
      <div className="grid gap-6">
        {/* Dashboard Pages Overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Dashboard Overview</h2>
            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
              Quick Access
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Reports</CardTitle>
                <CardDescription className="text-blue-700">Business analysis reports</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Reports</span>
                    <span className="font-semibold">{totalReports}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Recent</span>
                    <span className="font-semibold">{recentReports} this month</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/dashboard/reports">
                    <Eye className="h-4 w-4 mr-2" />
                    View Reports
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Book className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Read</CardTitle>
                <CardDescription className="text-green-700">Digital book access</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Chapter</span>
                    <span className="font-semibold">Chapter 4</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-semibold">{readingProgress}%</span>
                  </div>
                  <Progress value={readingProgress} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/dashboard/read">
                    <Book className="h-4 w-4 mr-2" />
                    Continue Reading
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Book Insights</CardTitle>
                <CardDescription className="text-purple-700">Key concepts & summaries</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Available Insights</span>
                    <span className="font-semibold">12 chapters</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Documents</span>
                    <span className="font-semibold">{documents.length} uploaded</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/dashboard/insights">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Explore Insights
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Dumbbell className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Exercises</CardTitle>
                <CardDescription className="text-orange-700">Business development tasks</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span className="font-semibold">{completedExercises}/{totalExercises}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-semibold">{Math.round(exerciseProgress)}%</span>
                  </div>
                  <Progress value={exerciseProgress} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/dashboard/exercises">
                    <Dumbbell className="h-4 w-4 mr-2" />
                    View Exercises
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-md transition-shadow cursor-pointer opacity-75">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Calendar className="h-8 w-8 text-teal-600" />
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs">
                    Coming Soon
                  </Badge>
                </div>
                <CardTitle className="text-lg">Book a Session</CardTitle>
                <CardDescription className="text-teal-700">1-on-1 coaching sessions</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Next Available</span>
                    <span className="font-semibold">TBD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Session Length</span>
                    <span className="font-semibold">60 min</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button disabled variant="outline" size="sm" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Session
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <PlusCircle className="h-8 w-8 text-amber-600" />
                  <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 text-xs">
                    Packages: {packages.length}
                  </Badge>
                </div>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription className="text-amber-700">Common tasks & shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2 text-sm">
                  <div>• Generate new report</div>
                  <div>• Create package</div>
                  <div>• Upload documents</div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/dashboard/reports">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Report
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Business Overview Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Business Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardDescription className="text-blue-700">Total Reports</CardDescription>
                <CardTitle className="text-2xl font-bold flex items-center text-blue-900">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  {totalReports}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700">{recentReports} this month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardDescription className="text-green-700">Documents Uploaded</CardDescription>
                <CardTitle className="text-2xl font-bold flex items-center text-green-900">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  {documents.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700">Available for analysis</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-2">
                <CardDescription className="text-purple-700">Packages Created</CardDescription>
                <CardTitle className="text-2xl font-bold flex items-center text-purple-900">
                  <Package className="h-5 w-5 mr-2 text-purple-600" />
                  {packages.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-700">Ready to share</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardHeader className="pb-2">
                <CardDescription className="text-amber-700">Business Health</CardDescription>
                <CardTitle className="text-2xl font-bold flex items-center text-amber-900">
                  <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
                  {businessHealthScore || 'N/A'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-700">
                  {businessHealthScore ? 'From latest report' : 'No reports yet'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Latest Report Summary */}
        {latestReport ? (
          <Card className="shadow-md">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Latest Business Analysis</CardTitle>
                  <CardDescription>
                    {latestReport.company_name} - {latestReport.title}
                  </CardDescription>
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
                      <span className="text-3xl font-bold mr-2">{Math.round(businessHealthScore)}</span>
                      <span className="text-sm text-green-600 font-medium">/100</span>
                    </div>
                    <Progress value={businessHealthScore} className="h-2 mt-2" />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground mb-2">Report Status</span>
                    <div className="flex items-center">
                      <Badge variant={latestReport.status === 'Completed' ? 'default' : 'secondary'}>
                        {latestReport.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground mb-2">Created</span>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-base font-medium">{lastReportDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Exercise: {latestReport.exercise_id}
              </div>
              <Button size="sm" asChild>
                <Link to={`/dashboard/reports`}>
                  View Full Report <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Create your first business analysis report</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Upload your business documents and start analyzing your company's performance.
              </p>
              <Button asChild>
                <Link to="/dashboard/reports">
                  Create Your First Report <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Call to Action */}
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle>Ready to take your business to the next level?</CardTitle>
            <CardDescription className="text-primary-foreground/90">
              {documents.length > 0 ? 'Continue analyzing your business with our AI tools' : 'Upload your first document to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90">
              {documents.length > 0 
                ? 'Generate new reports, create packages, and get AI-powered insights for your business.'
                : 'Get AI-powered business insights by uploading your company documents and creating your first analysis report.'
              }
            </p>
          </CardContent>
          <CardFooter>
            {documents.length > 0 ? (
              <Button variant="secondary" asChild>
                <Link to="/dashboard/reports">Generate New Report</Link>
              </Button>
            ) : (
              <Button variant="secondary" asChild>
                <Link to="/chat">Upload Documents</Link>
              </Button>
            )}
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
