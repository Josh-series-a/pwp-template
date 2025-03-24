
import React, { useState, useEffect } from 'react';
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
  Plus
} from 'lucide-react';
import RunAnalysisModal from '@/components/reports/RunAnalysisModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Report {
  id: string;
  title: string;
  date: string;
  company: string;
  status: string;
}

const Reports = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch reports from Supabase
  useEffect(() => {
    const fetchReports = async () => {
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
            status: report.status
          }));
          setReports(formattedReports);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: "Error",
          description: "Failed to load reports. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [toast]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAnalysisComplete = async (companyName: string, exerciseTitle: string) => {
    try {
      // Extract exercise ID from the title format "Exercise X: Title"
      const exerciseMatch = exerciseTitle.match(/Exercise (\d+):/);
      const exerciseId = exerciseMatch ? `exercise-${exerciseMatch[1]}` : 'unknown';
      
      // Add the new report to Supabase
      const { data, error } = await supabase
        .from('reports')
        .insert({
          title: exerciseTitle,
          company_name: companyName,
          exercise_id: exerciseId,
          status: 'In Progress'
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Add the new report to the UI state
        const newReport = {
          id: data.id,
          title: data.title,
          date: data.created_at,
          company: data.company_name,
          status: data.status
        };
        
        setReports([newReport, ...reports]);
      }
      
      closeModal();
      
      // Show success toast
      toast({
        title: "Analysis Started",
        description: `Analysis for ${companyName} is now in progress. Estimated completion time: 20 minutes.`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        title: "Error",
        description: "Failed to create report. Please try again.",
        variant: "destructive",
      });
    }
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
              <div className="text-center py-8">Loading reports...</div>
            ) : reports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
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
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" asChild title="View">
                            <span><Eye className="h-4 w-4" /></span>
                          </Button>
                          <Button variant="outline" size="icon" asChild title="Download">
                            <span><DownloadCloud className="h-4 w-4" /></span>
                          </Button>
                          <Button variant="outline" size="icon" asChild title="Re-analyze">
                            <span><RefreshCw className="h-4 w-4" /></span>
                          </Button>
                          <Button variant="outline" size="icon" asChild title="Share">
                            <span><Share2 className="h-4 w-4" /></span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                No reports found. Click "Run New Analysis" to create your first report.
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
    </DashboardLayout>
  );
};

export default Reports;
