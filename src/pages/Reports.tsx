import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { 
  DownloadCloud, 
  Eye, 
  RefreshCw,
  Share2, 
  Plus,
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import RunAnalysisModal from '@/components/reports/RunAnalysisModal';
import ViewReportModal from '@/components/reports/ViewReportModal';
import LoadingRayMeter from '@/components/LoadingRayMeter';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Report {
  id: string;
  title: string;
  date: string;
  company: string;
  status: string;
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
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

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
            exerciseId: report.exercise_id,
            companyId: report.company_id,
            plan: report.plan_score,
            people: report.people_score,
            profits: report.profits_score,
            purposeImpact: report.purpose_impact_score,
            stressLeadership: report.stress_leadership_score,
            overall: report.overall_score,
          }));
          setReports(formattedReports);
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

  const openModal = () => {
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
          url: shareUrl,
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
      
      const { data: reportData, error } = await supabase
        .from('reports')
        .insert({
          title: exerciseTitle,
          company_name: companyName,
          exercise_id: exerciseId,
          status: 'In Progress',
          user_id: user.id,
          pitch_deck_url: pitchDeckUrl,
          company_id: companyId
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
          pitchDeckUrl: reportData.pitch_deck_url,
          exerciseId: reportData.exercise_id,
          companyId: reportData.company_id,
          plan: reportData.plan_score,
          people: reportData.people_score,
          profits: reportData.profits_score,
          purposeImpact: reportData.purpose_impact_score,
          stressLeadership: reportData.stress_leadership_score,
          overall: reportData.overall_score,
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
          
          if (companyId) {
            webhookUrl.searchParams.append('companyId', companyId);
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
            mode: 'no-cors',
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
    if (score === null || score === undefined) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatScore = (score: number | null | undefined) => {
    return score !== null && score !== undefined ? Math.round(score * 10) / 10 : '-';
  };

  const ScoreCell = ({ score }: { score: number | null | undefined }) => {
    if (score === null || score === undefined) {
      return (
        <TableCell className="text-center">
          <div className="flex justify-center">
            <Skeleton className="h-4 w-8" />
          </div>
        </TableCell>
      );
    }
    
    return (
      <TableCell className={`text-center font-medium ${getScoreColor(score)}`}>
        {formatScore(score)}
      </TableCell>
    );
  };

  return (
    <DashboardLayout title="My Reports">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            View all your business health checks and analyses
          </p>
          <Button onClick={openModal}>
            <Plus className="mr-2 h-4 w-4" />
            Run New Analysis
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              All AI-generated evaluations, archived and downloadable
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <LoadingRayMeter size="lg" autoAnimate={true} />
                <p className="text-muted-foreground">Loading reports...</p>
              </div>
            ) : reports.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Company</TableHead>
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
                    {reports.map((report) => (
                      <TableRow 
                        key={report.id} 
                        className="cursor-pointer hover:bg-muted/70"
                        onClick={() => navigateToReport(report)}
                      >
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                        <TableCell>{report.company}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            report.status === 'In Progress' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {report.status}
                          </span>
                        </TableCell>
                        <ScoreCell score={report.plan} />
                        <ScoreCell score={report.people} />
                        <ScoreCell score={report.profits} />
                        <ScoreCell score={report.purposeImpact} />
                        <ScoreCell score={report.stressLeadership} />
                        <ScoreCell score={report.overall} />
                        <TableCell className="text-right">
                          <div 
                            onClick={(e) => e.stopPropagation()}
                          >
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
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(report)}
                                  className="text-red-600 focus:text-red-600"
                                >
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
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <LoadingRayMeter size="lg" progress={0} autoAnimate={false} />
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium">No reports found</p>
                  <p className="text-muted-foreground">Click "Run New Analysis" to create your first report.</p>
                </div>
              </div>
            )}
          </CardContent>
          {reports.length > 0 && (
            <CardFooter>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Run a New Analysis</CardTitle>
            <CardDescription>
              Generate a fresh business health check based on your current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Running a new analysis will assess your business's current health across finance, operations, 
              marketing, and leadership domains. The AI will generate personalized recommendations based on the book's principles.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={openModal}>
              <Plus className="mr-2 h-4 w-4" />
              Start New Business Health Check
            </Button>
          </CardFooter>
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
    </DashboardLayout>
  );
};

export default Reports;
