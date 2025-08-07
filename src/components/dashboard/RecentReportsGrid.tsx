import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, FileText, Calendar, TrendingUp, Eye, Users, DollarSign, Target, Zap, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface RecentReport {
  id: string;
  title: string;
  company_name: string;
  status: string;
  status_type: string;
  overall_score: number;
  plan_score: number;
  people_score: number;
  profits_score: number;
  purpose_impact_score: number;
  stress_leadership_score: number;
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

  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return 'text-muted-foreground';
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return 'bg-muted/20';
    if (score >= 8) return 'bg-green-100/50';
    if (score >= 5) return 'bg-amber-100/50';
    return 'bg-red-100/50';
  };

  const formatScore = (score: number | null | undefined) => {
    return score !== null && score !== undefined ? Math.round(score * 10) / 10 : '-';
  };

  const navigateToReport = (report: RecentReport) => {
    const companySlug = report.company_name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/dashboard/reports/${companySlug}/${report.id}`);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.02] bg-gradient-to-br from-card to-card/50" onClick={() => navigateToReport(report)}>
              <CardHeader className="pb-4 space-y-4">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 space-y-2">
                    <CardTitle className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {report.company_name}
                    </CardTitle>
                    <div className="text-xs text-muted-foreground">
                      {new Date(report.created_at).toLocaleDateString('en-US', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                  <div onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60 hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigateToReport(report)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Status Tags */}
                <div className="flex gap-2">
                  <Badge 
                    variant={report.status_type === 'Existing' ? 'default' : 'secondary'} 
                    className={`text-xs font-medium px-2.5 py-1 ${
                      report.status_type === 'Existing' 
                        ? 'bg-amber-100 text-amber-800 border-amber-200' 
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    }`}
                  >
                    {report.status_type}
                  </Badge>
                  <Badge 
                    variant={report.status === 'Completed' ? 'default' : 'outline'} 
                    className={`text-xs font-medium px-2.5 py-1 ${
                      report.status === 'Completed' 
                        ? 'bg-slate-800 text-white border-slate-800' 
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                {/* Overall Score - Prominent Display */}
                {(report.overall_score !== null && report.overall_score !== undefined) && (
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${getScoreBgColor(report.overall_score)} ${
                        report.overall_score >= 8 ? 'border-green-200' : 
                        report.overall_score >= 5 ? 'border-amber-200' : 'border-red-200'
                      }`}>
                        <div className="text-center">
                          <div className={`text-xl font-bold ${getScoreColor(report.overall_score)}`}>
                            {formatScore(report.overall_score)}
                          </div>
                          <div className="text-xs text-muted-foreground font-medium">
                            Overall
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Metrics Grid */}
                {(report.plan_score !== null && report.plan_score !== undefined) && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Plan</span>
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(report.plan_score)}`}>
                        {formatScore(report.plan_score)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">People</span>
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(report.people_score)}`}>
                        {formatScore(report.people_score)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Profits</span>
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(report.profits_score)}`}>
                        {formatScore(report.profits_score)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Purpose</span>
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(report.purpose_impact_score)}`}>
                        {formatScore(report.purpose_impact_score)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Progress for incomplete reports */}
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
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentReportsGrid;