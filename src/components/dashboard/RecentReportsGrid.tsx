import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, FileText, Calendar, TrendingUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface RecentReport {
  id: string;
  title: string;
  company_name: string;
  status: string;
  overall_score: number;
  created_at: string;
  exercise_id: string;
  current_progress: number;
}

const RecentReportsGrid: React.FC = () => {
  const [reports, setReports] = useState<RecentReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentReports();

    // Set up real-time subscription for reports
    const channel = supabase
      .channel('dashboard-recent-reports')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports'
        },
        (payload) => {
          console.log('Reports updated:', payload);
          fetchRecentReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchRecentReports = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching recent reports:', error);
        toast({ title: 'Failed to load recent reports', variant: 'destructive' });
        return;
      }

      setReports(data || []);
    } catch (error) {
      console.error('Error fetching recent reports:', error);
      toast({ title: 'Failed to load recent reports', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportClick = (reportId: string) => {
    navigate(`/dashboard/reports/pulse/${reportId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'new':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reports Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first business analysis report to get started.
            </p>
            <Button onClick={() => navigate('/dashboard/reports')}>
              <FileText className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Reports ({reports.length})
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/reports')}>
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => handleReportClick(report.id)}
              className="relative overflow-hidden rounded-lg border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br from-white to-gray-50/50"
            >
              <div className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {report.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {report.company_name}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(report.status)} ml-2 flex-shrink-0`}
                  >
                    {report.status}
                  </Badge>
                </div>

                {/* Score */}
                {report.overall_score > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Health Score</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span className={`text-sm font-bold ${getScoreColor(report.overall_score)}`}>
                          {Math.round(report.overall_score)}
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={report.overall_score} 
                      className="h-1.5 bg-gray-100" 
                    />
                  </div>
                )}

                {/* Progress */}
                {report.current_progress > 0 && report.current_progress < 100 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium">
                        {Math.round(report.current_progress)}%
                      </span>
                    </div>
                    <Progress 
                      value={report.current_progress} 
                      className="h-1.5 bg-gray-100" 
                    />
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {report.exercise_id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentReportsGrid;