
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, FileText, BookOpen, ArrowRight, BarChart3, TrendingUp, Users, AlertCircle, Book, Dumbbell, Package, Eye, PlusCircle, Sparkles, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { apiService } from '@/utils/apiService';
import PackageQueueSection from '@/components/dashboard/PackageQueueSection';
import RecentPackagesCarousel from '@/components/dashboard/RecentPackagesCarousel';
import RecentReportsGrid from '@/components/dashboard/RecentReportsGrid';

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'there';
  
  // Real data states
  const [reports, setReports] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestReport, setLatestReport] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data: reportsData } = await supabase
          .from('reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (reportsData) {
          setReports(reportsData);
          setLatestReport(reportsData[0] || null);
        }

        const { data: packagesData } = await supabase
          .from('packages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (packagesData) {
          setPackages(packagesData);
        }

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
  const businessHealthScore = latestReport?.overall_score || 0;
  const completedReports = reports.filter(r => r.status === 'Completed').length;
  const totalReportsForProgress = Math.max(reports.length, 1);
  const completionPercentage = (completedReports / totalReportsForProgress) * 100;
  const readingProgress = 65;
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
      <div className="relative">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-green-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 grid gap-6 md:gap-8">
          {/* Welcome Card with Latest Report */}
          {latestReport ? (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 pb-4 md:pb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                        Latest Business Analysis
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                          Active
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        {latestReport.company_name} - {latestReport.title}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="shadow-sm">
                    <Link to="/dashboard/reports">
                      <Eye className="h-4 w-4 mr-2" />
                      View All Reports
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Business Health Score</span>
                      <Sparkles className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-baseline">
                        <span className="text-3xl md:text-4xl font-bold text-primary">{Math.round(businessHealthScore)}</span>
                        <span className="text-lg text-muted-foreground ml-1">/100</span>
                      </div>
                      <Progress value={businessHealthScore} className="h-3 bg-gray-100" />
                      <p className="text-xs text-muted-foreground">
                        {businessHealthScore >= 80 ? 'Excellent' : businessHealthScore >= 60 ? 'Good' : businessHealthScore >= 40 ? 'Fair' : 'Needs Improvement'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Report Status</span>
                      <Activity className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <Badge 
                        variant={latestReport.status === 'Completed' ? 'default' : 'secondary'}
                        className="text-sm px-3 py-1"
                      >
                        {latestReport.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {latestReport.status === 'Completed' ? 'Ready for review' : 'In progress'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Created</span>
                      <Calendar className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-lg font-semibold">{lastReportDate}</span>
                      <p className="text-xs text-muted-foreground">
                        Exercise: {latestReport.exercise_id}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gradient-to-r from-gray-50 to-blue-50/30 pt-4">
                <Button asChild className="ml-auto shadow-sm">
                  <Link to="/dashboard/reports">
                    View Full Report <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <PlusCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl text-blue-900">Get Started</CardTitle>
                    <CardDescription className="text-blue-700">Create your first business analysis report</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Upload your business documents and start analyzing your company's performance with AI-powered insights.
                </p>
                <Button asChild className="w-full sm:w-auto shadow-sm">
                  <Link to="/dashboard/reports">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Your First Report
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Package Queue and Recent Packages */}
          <div className="grid gap-6 lg:grid-cols-2">
            <PackageQueueSection />
            <RecentPackagesCarousel />
          </div>

          {/* Recent Reports Grid */}
          <RecentReportsGrid />

          {/* Dashboard Pages Overview */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 text-center sm:text-left">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-center">Dashboard Overview</h2>
                <p className="text-muted-foreground text-center">Quick access to all your tools</p>
              </div>
              <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-800 border-blue-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Quick Access
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Reports Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-150/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-200 text-blue-800">{totalReports}</Badge>
                  </div>
                  <CardTitle className="text-lg text-blue-900">Reports</CardTitle>
                  <CardDescription className="text-blue-700">Business analysis reports</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Total Reports</span>
                      <span className="font-semibold text-blue-900">{totalReports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">This Month</span>
                      <span className="font-semibold text-blue-900">{recentReports}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full group-hover:bg-blue-100 border-blue-200">
                    <Link to="/dashboard/reports">
                      <Eye className="h-4 w-4 mr-2" />
                      View Reports
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Read Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-150/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Book className="h-6 w-6 text-green-600" />
                    </div>
                    <Badge variant="secondary" className="bg-green-200 text-green-800">{readingProgress}%</Badge>
                  </div>
                  <CardTitle className="text-lg text-green-900">Read</CardTitle>
                  <CardDescription className="text-green-700">Digital book access</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Current Chapter</span>
                      <span className="font-semibold text-green-900">Chapter 4</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Progress</span>
                        <span className="font-semibold text-green-900">{readingProgress}%</span>
                      </div>
                      <Progress value={readingProgress} className="h-2 bg-green-100" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full group-hover:bg-green-100 border-green-200">
                    <Link to="/dashboard/read">
                      <Book className="h-4 w-4 mr-2" />
                      Continue Reading
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Book Insights Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-150/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <Badge variant="secondary" className="bg-purple-200 text-purple-800">12</Badge>
                  </div>
                  <CardTitle className="text-lg text-purple-900">Book Insights</CardTitle>
                  <CardDescription className="text-purple-700">Key concepts & summaries</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Available Insights</span>
                      <span className="font-semibold text-purple-900">12 chapters</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Documents</span>
                      <span className="font-semibold text-purple-900">{documents.length} uploaded</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full group-hover:bg-purple-100 border-purple-200">
                    <Link to="/dashboard/insights">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Explore Insights
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Exercises Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 hover:from-orange-100 hover:to-orange-150/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <Dumbbell className="h-6 w-6 text-orange-600" />
                    </div>
                    <Badge variant="secondary" className="bg-orange-200 text-orange-800">{completedExercises}/{totalExercises}</Badge>
                  </div>
                  <CardTitle className="text-lg text-orange-900">Exercises</CardTitle>
                  <CardDescription className="text-orange-700">Business development tasks</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-700">Completed</span>
                      <span className="font-semibold text-orange-900">{completedExercises}/{totalExercises}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-orange-700">Progress</span>
                        <span className="font-semibold text-orange-900">{Math.round(exerciseProgress)}%</span>
                      </div>
                      <Progress value={exerciseProgress} className="h-2 bg-orange-100" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full group-hover:bg-orange-100 border-orange-200">
                    <Link to="/dashboard/exercises">
                      <Dumbbell className="h-4 w-4 mr-2" />
                      View Exercises
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Book a Session Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-teal-100/50 opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-teal-600" />
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs">
                      Coming Soon
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-teal-900">Book a Session</CardTitle>
                  <CardDescription className="text-teal-700">1-on-1 coaching sessions</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-teal-700">Next Available</span>
                      <span className="font-semibold text-teal-900">TBD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-700">Session Length</span>
                      <span className="font-semibold text-teal-900">60 min</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button disabled variant="outline" size="sm" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                </CardFooter>
              </Card>

              {/* Quick Actions Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-150/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                      <PlusCircle className="h-6 w-6 text-amber-600" />
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                      {packages.length} Packages
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-amber-900">Quick Actions</CardTitle>
                  <CardDescription className="text-amber-700">Common tasks & shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-1 text-sm text-amber-700">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                      Generate new report
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                      Create package
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                      Upload documents
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full group-hover:bg-amber-100 border-amber-200">
                    <Link to="/dashboard/reports">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Report
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Business Overview Stats */}
          <div className="space-y-6">
                <div className="text-left">
              <h2 className="text-2xl font-bold mb-2">Business Overview</h2>
              <p className="text-muted-foreground">Your key business metrics at a glance</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <CardDescription className="text-blue-700 font-medium">Total Reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900 mb-1">{totalReports}</div>
                  <p className="text-sm text-blue-700">{recentReports} this month</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100/50 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <FileText className="h-8 w-8 text-green-600" />
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                  <CardDescription className="text-green-700 font-medium">Documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900 mb-1">{documents.length}</div>
                  <p className="text-sm text-green-700">Available for analysis</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Package className="h-8 w-8 text-purple-600" />
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </div>
                  <CardDescription className="text-purple-700 font-medium">Packages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900 mb-1">{packages.length}</div>
                  <p className="text-sm text-purple-700">Ready to share</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <BarChart3 className="h-8 w-8 text-amber-600" />
                    <div className={`h-2 w-2 rounded-full ${businessHealthScore ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                  <CardDescription className="text-amber-700 font-medium">Business Health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-900 mb-1">
                    {businessHealthScore ? Math.round(businessHealthScore) : 'N/A'}
                  </div>
                  <p className="text-sm text-amber-700">
                    {businessHealthScore ? 'From latest report' : 'No reports yet'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Call to Action */}
          <Card className="border-0 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl md:text-2xl">Ready to transform your business?</CardTitle>
                  <CardDescription className="text-primary-foreground/90 text-base">
                    {documents.length > 0 ? 'Continue your business journey with AI-powered insights' : 'Start your business transformation today'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-primary-foreground/80">
                {documents.length > 0 
                  ? 'Generate comprehensive reports, create shareable packages, and unlock AI-powered business insights.'
                  : 'Upload your business documents and get instant AI-powered analysis to unlock your company\'s potential.'
                }
              </p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              {documents.length > 0 ? (
                <Button variant="secondary" asChild className="w-full sm:w-auto shadow-sm">
                  <Link to="/dashboard/reports">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate New Report
                  </Link>
                </Button>
              ) : (
                <Button variant="secondary" asChild className="w-full sm:w-auto shadow-sm">
                  <Link to="/chat">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Link>
                </Button>
              )}
              <Button variant="outline" className="w-full sm:w-auto bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20">
                <BookOpen className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
