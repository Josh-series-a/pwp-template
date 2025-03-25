
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ViewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string | null;
}

interface SubmissionData {
  type: string;
  exerciseType?: string;
  exerciseNumber?: string;
  timestamp: string;
  data: Record<string, any>;
}

const ViewReportModal: React.FC<ViewReportModalProps> = ({ isOpen, onClose, reportId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReportDetails = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      try {
        // Fetch the report from Supabase
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .select('*')
          .eq('id', reportId)
          .single();
        
        if (reportError) throw reportError;
        
        setReport(reportData);
        
        // For demonstration, we'll simulate fetching submission data
        // In a real app, you would fetch this from your webhook destination or database
        
        // Simulate API delay
        setTimeout(() => {
          // This is mock data - in a real app you would fetch the actual submission data
          const mockSubmissionData = generateMockData(reportData);
          setSubmissions(mockSubmissionData);
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching report details:', error);
        toast({
          title: "Error",
          description: "Failed to load report details. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    if (isOpen && reportId) {
      fetchReportDetails();
    } else {
      setReport(null);
      setSubmissions([]);
    }
  }, [isOpen, reportId, toast]);

  // This function generates mock data based on the report type
  // In a real app, you would replace this with actual data from your backend
  const generateMockData = (report: any): SubmissionData[] => {
    const submissions: SubmissionData[] = [];
    
    // Extract exercise number from the exercise_id
    const exerciseNumber = report.exercise_id.split('-')[1] || '0';
    const timestamp = new Date(report.created_at).toISOString();
    
    // Add exercise submission
    if (report.exercise_id === 'exercise-4') {
      submissions.push({
        type: 'exercise',
        exerciseType: 'Exit Strategy',
        exerciseNumber,
        timestamp,
        data: {
          hasStrategy: 'yes',
          exitDateText: 'In 5 years',
          hasPlan: 'Yes, we have a detailed plan to prepare the business for acquisition.',
          implementationSteps: 'Building recurring revenue, documenting processes, expanding client base.',
          resources: '20% of profits are allocated to implementing the exit strategy.'
        }
      });
    } else if (report.exercise_id === 'exercise-6') {
      submissions.push({
        type: 'exercise',
        exerciseType: 'Know Your Customer',
        exerciseNumber,
        timestamp,
        data: {
          personaDescription: 'Small business owner looking to grow',
          age: '35-45',
          gender: 'Mixed',
          location: 'Urban areas',
          personalSituation: 'Established business owners',
          challenges: 'Time management, scaling operations, hiring difficulties',
          goals: 'Growing revenue by 30%, reducing working hours'
        }
      });
    } else {
      submissions.push({
        type: 'exercise',
        exerciseType: 'General Analysis',
        exerciseNumber,
        timestamp,
        data: {
          information: 'This exercise data would be retrieved from your webhook destination.'
        }
      });
    }
    
    // Add company submission
    submissions.push({
      type: 'company',
      timestamp,
      data: {
        companyName: report.company_name,
        industry: 'Technology',
        companySize: 'Small (10-50 employees)',
        yearFounded: '2018',
        location: 'London, UK'
      }
    });
    
    return submissions;
  };

  const renderSubmissionData = (submission: SubmissionData) => {
    return (
      <div key={`${submission.type}-${submission.timestamp}`} className="mb-6 border rounded-md p-4">
        <h3 className="text-lg font-medium mb-2 capitalize">
          {submission.type === 'exercise' ? 
            `${submission.exerciseType || 'Exercise'} Data` : 
            'Company Information'}
        </h3>
        
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(submission.data).map(([key, value]) => (
            <div key={key} className="py-1">
              <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
              <span className="text-sm">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {report ? report.title : 'Report Details'}
          </DialogTitle>
          <DialogDescription>
            {report ? (
              <div className="flex justify-between text-sm mt-1">
                <span>Company: {report.company_name}</span>
                <span>Date: {new Date(report.created_at).toLocaleDateString()}</span>
              </div>
            ) : 'Loading report information...'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Loading submission data...</p>
            </div>
          ) : submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map(renderSubmissionData)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
              <p className="text-sm text-muted-foreground">
                No submission data found for this report. This could be because the data is stored externally.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportModal;
