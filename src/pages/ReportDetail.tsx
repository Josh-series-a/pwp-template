
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  RefreshCw, 
  AlertTriangle,
  Loader2 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubmissionData {
  type: string;
  exerciseType?: string;
  exerciseNumber?: string;
  timestamp: string;
  data: Record<string, any>;
  submitter?: {
    name: string;
    email: string;
  };
  companyId?: string;
}

const ReportDetail = () => {
  const { companySlug, exerciseId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReportDetails = async () => {
      if (!exerciseId || !companySlug) return;
      
      setIsLoading(true);
      try {
        // Convert companySlug back to company name format (e.g., "acme" -> "Acme")
        const companyName = companySlug.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        console.log(`Fetching report for company "${companyName}" and exerciseId "${exerciseId}"`);
        
        // Fetch the report from Supabase with BOTH company_name and exercise_id filters
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .select('*')
          .eq('exercise_id', exerciseId)
          .ilike('company_name', companyName) // Use case-insensitive matching
          .maybeSingle(); // Use maybeSingle() instead of single()
        
        if (reportError) throw reportError;
        
        if (reportData) {
          console.log("Found report:", reportData);
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
        } else {
          toast({
            title: "Report not found",
            description: `No report found for ${companySlug}/${exerciseId}`,
            variant: "destructive",
          });
          navigate('/dashboard/reports');
        }
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

    fetchReportDetails();
  }, [companySlug, exerciseId, toast, navigate]);

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
        },
        submitter: {
          name: 'John Smith',
          email: 'john.smith@example.com'
        },
        companyId: 'comp-' + Math.floor(Math.random() * 1000)
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
        },
        submitter: {
          name: 'Jane Doe',
          email: 'jane.doe@example.com'
        },
        companyId: 'comp-' + Math.floor(Math.random() * 1000)
      });
    } else if (report.exercise_id === 'exercise-18') {
      submissions.push({
        type: 'exercise',
        exerciseType: 'Measure Your Delegation',
        exerciseNumber,
        timestamp,
        data: {
          currentDelegationScore: '6/10',
          delegatedTasks: 'Client onboarding, social media management, bookkeeping',
          improvementAreas: 'Strategic planning, content creation, team management',
          delegationGoals: 'Increase delegation by 30% in next quarter',
          resourcesNeeded: 'Hiring a virtual assistant, implementing project management tools'
        },
        submitter: {
          name: 'Lydia Smith',
          email: 'lydia.smith@example.com'
        },
        companyId: 'comp-' + Math.floor(Math.random() * 1000)
      });
    } else {
      submissions.push({
        type: 'exercise',
        exerciseType: 'General Analysis',
        exerciseNumber,
        timestamp,
        data: {
          information: 'This exercise data would be retrieved from your webhook destination.'
        },
        submitter: {
          name: 'Alex Johnson',
          email: 'alex.johnson@example.com'
        },
        companyId: 'comp-' + Math.floor(Math.random() * 1000)
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
      },
      submitter: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com'
      },
      companyId: 'comp-' + Math.floor(Math.random() * 1000)
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
          
          {/* Display submitter information */}
          {submission.submitter && (
            <div className="py-2 mt-2 border-t">
              <h4 className="text-sm font-semibold mb-1">Submitted by:</h4>
              <div className="text-sm">
                <div>{submission.submitter.name}</div>
                <div>{submission.submitter.email}</div>
                {submission.companyId && <div>Company ID: {submission.companyId}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title={`Report: ${report?.title || 'Loading...'}`}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard/reports')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reports
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" /> Re-analyze
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Loading report data...</p>
            </CardContent>
          </Card>
        ) : report ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription className="flex justify-between">
                  <span>Company: {report.company_name}</span>
                  <span>Generated: {new Date(report.created_at).toLocaleDateString()}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="report">
                  <TabsList className="mb-4">
                    <TabsTrigger value="report">Report Details</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="report" className="space-y-4">
                    {submissions.length > 0 ? (
                      <div>
                        {submissions.map(renderSubmissionData)}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No submission data found for this report.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="analysis">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Analysis</h3>
                      <p>
                        Based on the information provided, this business shows strengths in operational efficiency
                        but has areas to improve in delegation and strategic planning. The current delegation score of 6/10
                        indicates moderate effectiveness but room for significant improvement.
                      </p>
                      
                      <h4>Strengths</h4>
                      <ul>
                        <li>Effective delegation of routine tasks like client onboarding and bookkeeping</li>
                        <li>Clear recognition of improvement areas</li>
                        <li>Specific delegation goals set for the next quarter</li>
                      </ul>
                      
                      <h4>Areas for Improvement</h4>
                      <ul>
                        <li>Strategic planning remains centralized and could benefit from team input</li>
                        <li>Content creation bottlenecks slow down marketing efforts</li>
                        <li>Team management delegation needs structure and clear processes</li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recommendations">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Recommendations</h3>
                      <p>
                        Based on our analysis, we recommend the following actions to improve your business delegation:
                      </p>
                      
                      <h4>Short-term Actions (1-3 months)</h4>
                      <ol>
                        <li><strong>Hire a virtual assistant</strong> to handle administrative tasks and basic content creation</li>
                        <li><strong>Implement project management tools</strong> to streamline task delegation and tracking</li>
                        <li><strong>Create documented processes</strong> for currently delegated tasks to ensure consistency</li>
                      </ol>
                      
                      <h4>Medium-term Actions (3-6 months)</h4>
                      <ol>
                        <li><strong>Develop a team input system</strong> for strategic planning to distribute decision-making</li>
                        <li><strong>Train team leaders</strong> in key management responsibilities to take ownership of team performance</li>
                        <li><strong>Establish content creation workflows</strong> with clear approval processes</li>
                      </ol>
                      
                      <h4>Long-term Vision (6-12 months)</h4>
                      <p>
                        Achieve a delegation score of 8+/10 by creating self-managing teams that require minimal oversight,
                        freeing leadership to focus on business growth and innovation.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
              <p className="text-sm text-muted-foreground">Report not found</p>
              <Button onClick={() => navigate('/dashboard/reports')} className="mt-4">
                Return to Reports
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportDetail;
