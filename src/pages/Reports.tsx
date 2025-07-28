import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DownloadCloud, Eye, RefreshCw, Share2, Plus, MoreHorizontal, Trash2, Package, Grid3X3, List, TrendingUp, Users, DollarSign, Target, Zap, BarChart3, Search, Filter } from 'lucide-react';
import RunAnalysisModal from '@/components/reports/RunAnalysisModal';
import ViewReportModal from '@/components/reports/ViewReportModal';
import CreatePackageDialog from '@/components/reports/CreatePackageDialog';
import LoadingRayMeter from '@/components/LoadingRayMeter';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { toast } from 'sonner';

interface Report {
  id: string;
  title: string;
  date: string;
  company: string;
  status: string;
  statusType: string;
  pitchDeckUrl?: string;
  exerciseId?: string;
  companyId?: string;
  plan?: number;
  people?: number;
  profits?: number;
  purposeImpact?: number;
  stressLeadership?: number;
  overall?: number;
}

const Reports = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createPackageOpen, setCreatePackageOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allRecommendedCIKs, setAllRecommendedCIKs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statusTypeFilter, setStatusTypeFilter] = useState<string>('all');
  const { user } = useAuth();
  const { credits, checkCredits } = useCredits();
  const navigate = useNavigate();

  // Check if user has enough credits for Business Health Score (requires 10 credits)
  const hasEnoughCredits = checkCredits(10);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const formattedReports = data.map(report => ({
            id: report.id,
            title: report.title,
            date: report.created_at,
            company: report.company_name,
            status: report.status,
            statusType: report.status_type,
            exerciseId: report.exercise_id,
            companyId: report.company_id,
            plan: report.plan_score,
            people: report.people_score,
            profits: report.profits_score,
            purposeImpact: report.purpose_impact_score,
            stressLeadership: report.stress_leadership_score,
            overall: report.overall_score
          }));
          setReports(formattedReports);

          // Fetch all CIKs from all reports
          const allCIKs = new Set<string>();
          for (const report of data) {
            try {
              const healthUrl = `https://eiksxjzbwzujepqgmxsp.supabase.co/functions/v1/business-health?reportId=${report.id}`;
              const healthFetch = await fetch(healthUrl, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa3N4anpid3p1amVwcWdteHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTk4NTMsImV4cCI6MjA1ODM5NTg1M30.8DC-2c-QaqQlGbwrw2bNutDfTJYFFEPtPbzhWobZOLY`,
                  'Content-Type': 'application/json'
                }
              });
              const healthData = await healthFetch.json();
              if (healthData?.success && healthData?.data) {
                healthData.data.forEach((item: any) => {
                  if (item.recommended_ciks && Array.isArray(item.recommended_ciks)) {
                    item.recommended_ciks.forEach((cik: string) => allCIKs.add(cik));
                  }
                });
              }
            } catch (error) {
              console.error('Error fetching CIKs for report:', report.id, error);
            }
          }
          setAllRecommendedCIKs(Array.from(allCIKs));
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast.error("Failed to load reports. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  const findOriginalNewReport = async (companyName: string) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('id')
        .eq('company_name', companyName)
        .eq('status_type', 'New')
        .order('created_at', { ascending: true })
        .limit(1);

      if (error) throw error;
      return data && data.length > 0 ? data[0].id : null;
    } catch (error) {
      console.error('Error finding original report:', error);
      return null;
    }
  };

  const openModal = () => {
    if (!hasEnoughCredits) {
      toast.error(`You need 10 credits to run a Business Health Score. You currently have ${credits?.credits || 0} credits.`);
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openViewModal = (reportId: string) => {
    setSelectedReportId(reportId);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedReportId(null);
    setViewModalOpen(false);
  };

  const navigateToReport = (report: Report) => {
    const companySlug = report.company.toLowerCase().replace(/\s+/g, '-');
    navigate(`/dashboard/reports/${companySlug}/${report.exerciseId || 'unknown'}/${report.id}`);
  };

  const handleDownload = async (report: Report) => {
    try {
      const reportContent = `
Business Health Check Report
Company: ${report.company}
Exercise: ${report.title}
Date: ${new Date(report.date).toLocaleDateString()}
Status: ${report.status}

This report was generated on ${new Date().toLocaleDateString()}.
      `.trim();

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.company}-${report.title.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  const handleReAnalyze = async (report: Report) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: 'In Progress' })
        .eq('id', report.id);

      if (error) throw error;

      setReports(reports.map(r => 
        r.id === report.id ? { ...r, status: 'In Progress' } : r
      ));

      toast.success(`Re-analysis started for ${report.company}. Estimated completion: 20 minutes.`);
    } catch (error) {
      console.error('Error re-analyzing report:', error);
      toast.error('Failed to start re-analysis');
    }
  };

  const handleShare = async (report: Report) => {
    try {
      const shareUrl = `${window.location.origin}/dashboard/reports/${report.company.toLowerCase().replace(/\s+/g, '-')}/${report.exerciseId || 'unknown'}/${report.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Business Health Check: ${report.company}`,
          text: `Check out this business health analysis for ${report.company}`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Report link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing report:', error);
      toast.error('Failed to share report');
    }
  };

  const handleAnalysisComplete = async (companyName: string, exerciseTitle: string, pitchDeckUrl?: string, type?: string, companyId?: string) => {
    try {
      if (!user) {
        toast.error("You must be logged in to create a report.");
        return;
      }

      const exerciseMatch = exerciseTitle.match(/Exercise (\d+):/);
      const exerciseId = exerciseMatch ? `exercise-${exerciseMatch[1]}` : 'unknown';

      let finalCompanyId = companyId;
      if (type === 'Existing') {
        const originalReportId = await findOriginalNewReport(companyName);
        if (originalReportId) {
          finalCompanyId = originalReportId;
        }
      }

      const { data: reportData, error } = await supabase
        .from('reports')
        .insert({
          title: exerciseTitle,
          company_name: companyName,
          exercise_id: exerciseId,
          status: 'In Progress',
          status_type: type || 'New',
          user_id: user.id,
          pitch_deck_url: pitchDeckUrl,
          company_id: finalCompanyId
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (reportData) {
        const newReport = {
          id: reportData.id,
          title: reportData.title,
          date: reportData.created_at,
          company: reportData.company_name,
          status: reportData.status,
          statusType: reportData.status_type,
          pitchDeckUrl: reportData.pitch_deck_url,
          exerciseId: reportData.exercise_id,
          companyId: reportData.company_id,
          plan: reportData.plan_score,
          people: reportData.people_score,
          profits: reportData.profits_score,
          purposeImpact: reportData.purpose_impact_score,
          stressLeadership: reportData.stress_leadership_score,
          overall: reportData.overall_score
        };

        setReports([newReport, ...reports]);

        try {
          const webhookUrl = new URL('https://hook.eu2.make.com/dioppcyf0ife7k5jcxfegfkoi9dir29n');
          webhookUrl.searchParams.append('reportId', reportData.id);
          webhookUrl.searchParams.append('companyName', companyName);
          webhookUrl.searchParams.append('exerciseTitle', exerciseTitle);
          webhookUrl.searchParams.append('exerciseId', exerciseId);
          webhookUrl.searchParams.append('userId', user.id);
          webhookUrl.searchParams.append('userEmail', user.email || '');
          webhookUrl.searchParams.append('userName', user.user_metadata?.name || 'Unknown User');
          webhookUrl.searchParams.append('status', 'In Progress');
          webhookUrl.searchParams.append('createdAt', reportData.created_at);
          webhookUrl.searchParams.append('timestamp', new Date().toISOString());
          webhookUrl.searchParams.append('type', type || 'New');
          if (finalCompanyId) {
            webhookUrl.searchParams.append('companyId', finalCompanyId);
          }
          if (pitchDeckUrl) {
            webhookUrl.searchParams.append('pitchDeckUrl', pitchDeckUrl);
          }

          const combinedQuestionsAnswers = [
            'What is your current monthly revenue? Strong financial foundation with positive cash flow',
            'How many employees do you have? Marketing strategy needs improvement',
            'What are your main marketing channels? Leadership team is well-structured'
          ];

          combinedQuestionsAnswers.forEach((qa, index) => {
            webhookUrl.searchParams.append(`questionsAnswers[${index}]`, qa);
          });

          console.log('Sending data to webhook with query parameters:', webhookUrl.toString());
          await fetch(webhookUrl.toString(), {
            method: 'GET',
            mode: 'no-cors'
          });
          console.log('Webhook data sent successfully via query parameters');
        } catch (webhookError) {
          console.error('Error sending data to webhook:', webhookError);
        }
      }

      closeModal();
      toast.success(`Analysis for ${companyName} is now in progress. Estimated completion time: 20 minutes.`);
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error("Failed to create report. Please try again.");
    }
  };

  const handleDelete = async (report: Report) => {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', report.id);

      if (error) throw error;

      setReports(reports.filter(r => r.id !== report.id));
      toast.success(`Report for ${report.company} has been deleted successfully`);
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
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

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'plan': return TrendingUp;
      case 'people': return Users;
      case 'profits': return DollarSign;
      case 'purpose': return Target;
      case 'stress': return Zap;
      default: return BarChart3;
    }
  };

  const handleCreatePackage = () => {
    setCreatePackageOpen(true);
  };

  const closeCreatePackageDialog = () => {
    setCreatePackageOpen(false);
  };

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchQuery === '' || 
      report.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      report.status.toLowerCase().includes(statusFilter.toLowerCase());
    
    const matchesStatusType = statusTypeFilter === 'all' || 
      report.statusType === statusTypeFilter;
    
    return matchesSearch && matchesStatus && matchesStatusType;
  });

  return (
    <DashboardLayout title="My Reports">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="flex-1">
            <p className="text-muted-foreground text-base">
              View all your business health checks and analyses
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:flex-shrink-0">
            {allRecommendedCIKs.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-sm font-medium text-muted-foreground">Recommended CIKs:</span>
                {allRecommendedCIKs.slice(0, 5).map((cik, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {cik}
                  </Badge>
                ))}
                {allRecommendedCIKs.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{allRecommendedCIKs.length - 5} more
                  </Badge>
                )}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={handleCreatePackage} className="w-full sm:w-auto">
                <Package className="mr-2 h-4 w-4" />
                Create Package
              </Button>
              <Button onClick={openModal} disabled={!hasEnoughCredits} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Run Business Health Score
              </Button>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>
                  All AI-generated evaluations, archived and downloadable
                </CardDescription>
              </div>
              <div className="flex gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports by company name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusTypeFilter} onValueChange={setStatusTypeFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Existing">Existing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <LoadingRayMeter size="lg" autoAnimate={true} />
                <p className="text-muted-foreground">Loading reports...</p>
              </div>
            ) : filteredReports.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredReports.map(report => (
                    <Card key={report.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.02] bg-gradient-to-br from-card to-card/50" onClick={() => navigateToReport(report)}>
                      <CardHeader className="pb-4 space-y-4">
                        {/* Header Section */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="text-sm font-medium text-primary tracking-wide">
                              Business Health Score
                            </div>
                            <CardTitle className="text-xl font-bold text-foreground truncate group-hover:text-primary transition-colors">
                              {report.company}
                            </CardTitle>
                            <div className="text-xs text-muted-foreground">
                              {new Date(report.date).toLocaleDateString('en-US', { 
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
                                <DropdownMenuItem onClick={() => openViewModal(report.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Quick View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownload(report)}>
                                  <DownloadCloud className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReAnalyze(report)}>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Re-analyze
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShare(report)}>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(report)} className="text-red-600 focus:text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Status Tags */}
                        <div className="flex gap-2">
                          <Badge 
                            variant={report.statusType === 'Existing' ? 'default' : 'secondary'} 
                            className={`text-xs font-medium px-2.5 py-1 ${
                              report.statusType === 'Existing' 
                                ? 'bg-amber-100 text-amber-800 border-amber-200' 
                                : 'bg-blue-100 text-blue-800 border-blue-200'
                            }`}
                          >
                            {report.statusType}
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

                      <CardContent className="pt-0 space-y-6">
                        {/* Overall Score - Prominent Display */}
                        {(report.overall !== null && report.overall !== undefined) && (
                          <div className="flex items-center justify-center">
                            <div className="relative">
                              <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${getScoreBgColor(report.overall)} ${
                                report.overall >= 8 ? 'border-green-200' : 
                                report.overall >= 5 ? 'border-amber-200' : 'border-red-200'
                              }`}>
                                <div className="text-center">
                                  <div className={`text-2xl font-bold ${getScoreColor(report.overall)}`}>
                                    {formatScore(report.overall)}
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
                        {(report.plan !== null && report.plan !== undefined) && (
                          <div className="grid grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium text-muted-foreground">Plan</span>
                                </div>
                                <span className={`text-lg font-bold ${getScoreColor(report.plan)}`}>
                                  {formatScore(report.plan)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium text-muted-foreground">People</span>
                                </div>
                                <span className={`text-lg font-bold ${getScoreColor(report.people)}`}>
                                  {formatScore(report.people)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium text-muted-foreground">Profits</span>
                                </div>
                                <span className={`text-lg font-bold ${getScoreColor(report.profits)}`}>
                                  {formatScore(report.profits)}
                                </span>
                              </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-2">
                                  <Target className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium text-muted-foreground">Purpose</span>
                                </div>
                                <span className={`text-lg font-bold ${getScoreColor(report.purposeImpact)}`}>
                                  {formatScore(report.purposeImpact)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-2">
                                  <Zap className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium text-muted-foreground">Stress</span>
                                </div>
                                <span className={`text-lg font-bold ${getScoreColor(report.stressLeadership)}`}>
                                  {formatScore(report.stressLeadership)}
                                </span>
                              </div>
                              <div className="py-2">
                                {/* Spacer to align with overall score above */}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Plan</TableHead>
                        <TableHead className="text-center">People</TableHead>
                        <TableHead className="text-center">Profits</TableHead>
                        <TableHead className="text-center">Purpose & Impact</TableHead>
                        <TableHead className="text-center">Stress & Leadership</TableHead>
                        <TableHead className="text-center">Overall</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map(report => (
                        <TableRow key={report.id} className="cursor-pointer hover:bg-muted/70" onClick={() => navigateToReport(report)}>
                          <TableCell className="font-medium">{report.title}</TableCell>
                          <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                          <TableCell>{report.company}</TableCell>
                          <TableCell>
                            <Badge variant={report.statusType === 'New' ? 'default' : 'secondary'} className="text-xs">
                              {report.statusType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={report.status === 'In Progress' ? 'outline' : 'default'} className="text-xs">
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className={`text-center font-medium ${getScoreColor(report.plan)}`}>
                            {formatScore(report.plan)}
                          </TableCell>
                          <TableCell className={`text-center font-medium ${getScoreColor(report.people)}`}>
                            {formatScore(report.people)}
                          </TableCell>
                          <TableCell className={`text-center font-medium ${getScoreColor(report.profits)}`}>
                            {formatScore(report.profits)}
                          </TableCell>
                          <TableCell className={`text-center font-medium ${getScoreColor(report.purposeImpact)}`}>
                            {formatScore(report.purposeImpact)}
                          </TableCell>
                          <TableCell className={`text-center font-medium ${getScoreColor(report.stressLeadership)}`}>
                            {formatScore(report.stressLeadership)}
                          </TableCell>
                          <TableCell className={`text-center font-medium ${getScoreColor(report.overall)}`}>
                            {formatScore(report.overall)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div onClick={e => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => navigateToReport(report)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Report
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openViewModal(report.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Quick View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDownload(report)}>
                                    <DownloadCloud className="mr-2 h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleReAnalyze(report)}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Re-analyze
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleShare(report)}>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(report)} className="text-red-600 focus:text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <LoadingRayMeter size="lg" progress={0} autoAnimate={false} />
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">
                    {reports.length === 0 ? "No reports found" : "No reports match your filters"}
                  </p>
                  <p className="text-muted-foreground">
                    {reports.length === 0 
                      ? "Click \"Run Business Health Score\" to create your first report." 
                      : "Try adjusting your search or filter criteria."}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <RunAnalysisModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSubmitComplete={handleAnalysisComplete} 
      />

      <ViewReportModal 
        isOpen={viewModalOpen} 
        onClose={closeViewModal} 
        reportId={selectedReportId} 
      />

      <CreatePackageDialog 
        isOpen={createPackageOpen} 
        onClose={closeCreatePackageDialog} 
      />
    </DashboardLayout>
  );
};

export default Reports;
