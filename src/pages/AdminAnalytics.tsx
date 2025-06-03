
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Users, FileText, Package, Activity, TrendingUp, Calendar, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalyticsData {
  totalUsers: number;
  totalReports: number;
  totalPackages: number;
  recentActivities: any[];
  userGrowth: any[];
  reportStats: any;
  packageStats: any;
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalReports: 0,
    totalPackages: 0,
    recentActivities: [],
    userGrowth: [],
    reportStats: {},
    packageStats: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);

      // Get session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      // Fetch users count via admin endpoint
      const usersResponse = await fetch(`https://eiksxjzbwzujepqgmxsp.supabase.co/functions/v1/admin-users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa3N4anpid3p1amVwcWdteHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTk4NTMsImV4cCI6MjA1ODM5NTg1M30.8DC-2c-QaqQlGbwrw2bNutDfTJYFFEPtPbzhWobZOLY',
          'Content-Type': 'application/json',
        },
      });

      const usersData = await usersResponse.json();
      const totalUsers = usersData?.users?.length || 0;

      // Fetch reports
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportsError) {
        console.error('Error fetching reports:', reportsError);
      }

      // Fetch packages
      const { data: packages, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (packagesError) {
        console.error('Error fetching packages:', packagesError);
      }

      // Fetch profiles for user info
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Calculate statistics
      const reportStats = {
        completed: reports?.filter(r => r.status === 'Completed').length || 0,
        inProgress: reports?.filter(r => r.status === 'In Progress').length || 0,
        new: reports?.filter(r => r.status === 'New').length || 0,
        averageScore: reports?.reduce((acc, r) => acc + (r.overall_score || 0), 0) / (reports?.length || 1)
      };

      const packageStats = {
        thisMonth: packages?.filter(p => {
          const packageDate = new Date(p.created_at);
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          return packageDate >= oneMonthAgo;
        }).length || 0,
        averageDocuments: packages?.reduce((acc, p) => {
          // Safely handle the Json type for documents
          const docs = Array.isArray(p.documents) ? p.documents : [];
          return acc + docs.length;
        }, 0) / (packages?.length || 1)
      };

      // Create recent activities from reports and packages
      const recentActivities = [
        ...(reports?.slice(0, 5).map(r => ({
          id: r.id,
          type: 'report',
          action: 'Report created',
          details: `${r.title} for ${r.company_name}`,
          user: r.user_id,
          date: r.created_at,
          status: r.status
        })) || []),
        ...(packages?.slice(0, 5).map(p => ({
          id: p.id,
          type: 'package',
          action: 'Package created',
          details: p.package_name,
          user: p.user_id,
          date: p.created_at,
          status: 'Created'
        })) || [])
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

      // Calculate user growth (simplified)
      const userGrowth = profiles?.reduce((acc: any[], profile) => {
        const date = new Date(profile.created_at).toLocaleDateString();
        const existing = acc.find(item => item.date === date);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ date, count: 1 });
        }
        return acc;
      }, []) || [];

      setAnalytics({
        totalUsers,
        totalReports: reports?.length || 0,
        totalPackages: packages?.length || 0,
        recentActivities,
        userGrowth: userGrowth.slice(0, 7), // Last 7 days
        reportStats,
        packageStats
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-700">Total Users</CardDescription>
              <CardTitle className="text-2xl font-bold flex items-center text-blue-900">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                {analytics.totalUsers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-green-700">Total Reports</CardDescription>
              <CardTitle className="text-2xl font-bold flex items-center text-green-900">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                {analytics.totalReports}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700">
                {analytics.reportStats.completed} completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-purple-700">Total Packages</CardDescription>
              <CardTitle className="text-2xl font-bold flex items-center text-purple-900">
                <Package className="h-5 w-5 mr-2 text-purple-600" />
                {analytics.totalPackages}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-700">
                {analytics.packageStats.thisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-amber-700">Avg. Report Score</CardDescription>
              <CardTitle className="text-2xl font-bold flex items-center text-amber-900">
                <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
                {Math.round(analytics.reportStats.averageScore || 0)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-700">Out of 100</p>
            </CardContent>
          </Card>
        </div>

        {/* Report Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Report Status Breakdown
              </CardTitle>
              <CardDescription>Current status of all reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Completed</span>
                  <Badge variant="default">{analytics.reportStats.completed}</Badge>
                </div>
                <Progress 
                  value={(analytics.reportStats.completed / analytics.totalReports) * 100} 
                  className="h-2" 
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">In Progress</span>
                  <Badge variant="secondary">{analytics.reportStats.inProgress}</Badge>
                </div>
                <Progress 
                  value={(analytics.reportStats.inProgress / analytics.totalReports) * 100} 
                  className="h-2" 
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">New</span>
                  <Badge variant="outline">{analytics.reportStats.new}</Badge>
                </div>
                <Progress 
                  value={(analytics.reportStats.new / analytics.totalReports) * 100} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                Package Analytics
              </CardTitle>
              <CardDescription>Package creation and usage statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold">{analytics.totalPackages}</div>
                  <div className="text-sm text-muted-foreground">Total Packages</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold">{analytics.packageStats.thisMonth}</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-xl font-bold">
                  {Math.round(analytics.packageStats.averageDocuments || 0)}
                </div>
                <div className="text-sm text-muted-foreground">Avg. Documents per Package</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              Recent System Activities
            </CardTitle>
            <CardDescription>Latest user activities and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.recentActivities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No recent activities found
                      </TableCell>
                    </TableRow>
                  ) : (
                    analytics.recentActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            {activity.type === 'report' ? (
                              <FileText className="h-3 w-3" />
                            ) : (
                              <Package className="h-3 w-3" />
                            )}
                            {activity.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{activity.action}</TableCell>
                        <TableCell>{activity.details}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              activity.status === 'Completed' ? 'default' : 
                              activity.status === 'In Progress' ? 'secondary' : 'outline'
                            }
                          >
                            {activity.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(activity.date)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              User Registration Trend
            </CardTitle>
            <CardDescription>Daily user registrations (last 7 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.userGrowth.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No user growth data available
                </div>
              ) : (
                analytics.userGrowth.map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{day.date}</span>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      +{day.count} users
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
