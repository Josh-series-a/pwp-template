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
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  RefreshCw, 
  AlertTriangle,
  Loader2,
  Briefcase,
  ArrowRight,
  Users,
  Handshake,
  TrendingUp,
  Award,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { reportService } from '@/utils/reportService';

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
  const { companySlug, exerciseId, reportId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReportDetails = async () => {
      if (!companySlug) {
        setError("Missing company information in URL");
        setIsLoading(false);
        return;
      }
      
      if (!exerciseId) {
        setError("Missing exercise ID in URL");
        setIsLoading(false);
        return;
      }

      if (!reportId) {
        setError("Missing report ID in URL");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Convert companySlug back to company name format (e.g., "acme" -> "Acme")
        const companyName = companySlug.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        console.log(`Fetching report for company "${companyName}", exerciseId "${exerciseId}", reportId "${reportId}"`);
        
        // Fetch the report using the reportId directly
        try {
          const reportData = await reportService.getReport(companyName, exerciseId, reportId);
          
          if (!reportData) {
            setError("Report not found");
            setIsLoading(false);
            toast({
              title: "Report not found",
              description: `No report found for the specified parameters`,
              variant: "destructive",
            });
            return;
          }
          
          console.log("Found report:", reportData);
          setReport(reportData);
          
          // If the report has tabs_data, use it
          if (reportData.tabs_data && reportData.tabs_data.length > 0) {
            // Process the tab data into submissions format
            const tabSubmissions = reportData.tabs_data.map((tab: any) => ({
              type: 'tab',
              exerciseType: tab.title,
              timestamp: reportData.updated_at,
              data: tab.content || {},
              submitter: {
                name: 'System',
                email: 'system@example.com'
              }
            }));
            
            setSubmissions(tabSubmissions);
            setIsLoading(false);
            return;
          } else {
            // For demonstration, we'll simulate fetching submission data
            setTimeout(() => {
              const mockSubmissionData = generateMockData(reportData);
              setSubmissions(mockSubmissionData);
              setIsLoading(false);
            }, 500);
          }
        } catch (fetchError: any) {
          console.error('Error fetching report:', fetchError);
          setError(`Error loading report: ${fetchError.message || 'Unknown error'}`);
          setIsLoading(false);
          toast({
            title: "Error",
            description: `Failed to load report: ${fetchError.message || 'Unknown error'}`,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error('Error in fetchReportDetails:', error);
        setError(`Error: ${error.message || 'Unknown error'}`);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load report details. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchReportDetails();
  }, [companySlug, exerciseId, reportId, toast, navigate]);

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

  // Save tab data to edge function when tabs are updated
  const handleSaveTabData = async () => {
    if (!report || !companySlug || !exerciseId || !reportId) {
      toast({
        title: "Error",
        description: "Missing required parameters for saving report data",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const companyName = report.company_name;
      const userId = report.user_id;
      
      // Example tab data - in a real app you would collect this from the UI
      const tabsData = [
        {
          tabId: 'executive-snapshot',
          title: 'Executive Snapshot',
          content: {
            overview: 'Overview of current exit readiness positioning',
            keyMetrics: ['Delegation Score: 6/10', 'Customer Retention: 87%']
          }
        },
        {
          tabId: 'exit-destination',
          title: 'Exit Destination',
          content: {
            timeline: '3-5 years',
            valuationMultiple: '6-8x annual recurring revenue'
          }
        }
      ];
      
      const result = await reportService.saveReport({
        companyName,
        exerciseId,
        tabs: tabsData,
        userId,
        reportId // Pass the current report ID for update
      });
      
      toast({
        title: "Success",
        description: "Report data saved successfully",
      });
      
      console.log('Saved report data:', result);
      
    } catch (error: any) {
      console.error('Error saving tab data:', error);
      toast({
        title: "Error",
        description: `Failed to save report data: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
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
            <Button variant="outline" size="sm" onClick={handleSaveTabData}>
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
        ) : error ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
              <p className="text-sm text-muted-foreground mb-2">{error}</p>
              <Button onClick={() => navigate('/dashboard/reports')} className="mt-4">
                Return to Reports
              </Button>
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
                <Tabs defaultValue="executive-snapshot">
                  <div className="relative">
                    <TabsList className="flex items-center justify-start gap-1 mb-4 overflow-x-auto pb-2 scrollbar-visible">
                      <TabsTrigger value="executive-snapshot">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Executive Snapshot
                      </TabsTrigger>
                      <TabsTrigger value="exit-destination">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Exit Destination
                      </TabsTrigger>
                      <TabsTrigger value="ideal-buyers">
                        <Users className="h-4 w-4 mr-2" />
                        Ideal Buyers
                      </TabsTrigger>
                      <TabsTrigger value="exit-proposition">
                        '1 + 1' Exit Proposition
                      </TabsTrigger>
                      <TabsTrigger value="leadership-delegation">
                        <Users className="h-4 w-4 mr-2" />
                        Leadership & Delegation
                      </TabsTrigger>
                      <TabsTrigger value="customer-relationship">
                        <Handshake className="h-4 w-4 mr-2" />
                        Customer Relationship
                      </TabsTrigger>
                      <TabsTrigger value="recommendations">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Strategic Recommendations
                      </TabsTrigger>
                      <TabsTrigger value="readiness-scorecard">
                        <Award className="h-4 w-4 mr-2" />
                        Exit-Readiness Scorecard
                      </TabsTrigger>
                      <TabsTrigger value="resources">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Purposeful-Exit Resources
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="executive-snapshot" className="space-y-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Executive Snapshot</h3>
                      <p>
                        Overview of {report.company_name}'s current exit readiness positioning and key metrics
                        that executives should focus on to maximize value in a potential acquisition.
                      </p>
                      
                      {/* Display submission data for this specific tab if available */}
                      {submissions.length > 0 && (
                        <div className="mt-4">
                          {submissions
                            .filter(s => s.type === 'exercise')
                            .map(renderSubmissionData)}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="exit-destination" className="space-y-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Exit Destination</h3>
                      <p>
                        Analysis of optimal exit strategies for {report.company_name}, including timeline
                        projections and potential acquisition models that align with company goals.
                      </p>
                      
                      <div className="bg-muted p-4 rounded-md mt-4">
                        <h4>Exit Timeline</h4>
                        <p>Target exit window: 3-5 years</p>
                        <p>Optimal valuation multiple: 6-8x annual recurring revenue</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ideal-buyers" className="space-y-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Ideal Buyers</h3>
                      <p>
                        Identification of the most likely and highest-value potential acquirers for 
                        {report.company_name}, with analysis of strategic fit and acquisition rationale.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="border p-4 rounded-md">
                          <h4>Strategic Buyers</h4>
                          <ul>
                            <li>Market consolidators seeking specific capabilities</li>
                            <li>Complementary product/service providers</li>
                            <li>Competitors looking to expand market share</li>
                          </ul>
                        </div>
                        <div className="border p-4 rounded-md">
                          <h4>Financial Buyers</h4>
                          <ul>
                            <li>Private equity firms specializing in industry roll-ups</li>
                            <li>Family offices interested in stable long-term returns</li>
                            <li>Investment groups focusing on operational improvements</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="exit-proposition" className="space-y-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>'1 + 1' Exit Proposition</h3>
                      <p>
                        Analysis of how {report.company_name} creates synergistic value for potential acquirers,
                        demonstrating why the combined entity would be worth more than the sum of its parts.
                      </p>
                      
                      <div className="bg-muted p-4 rounded-md mt-4">
                        <h4>Key Value Drivers</h4>
                        <ul>
                          <li>Customer base expansion opportunities</li>
                          <li>Technology/IP integration benefits</li>
                          <li>Operational efficiency improvements</li>
                          <li>Market positioning advantages</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="leadership-delegation" className="space-y-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Leadership & Delegation</h3>
                      <p>
                        Assessment of {report.company_name}'s leadership structure, delegation effectiveness,
                        and recommendations for building a self-sustaining management team that enhances exit value.
                      </p>
                      
                      <div className="mt-4">
                        <h4>Current Delegation Score: 6/10</h4>
                        <p>Primary delegation challenges:</p>
                        <ul>
                          <li>Strategic planning remains centralized and could benefit from team input</li>
                          <li>Content creation bottlenecks slow down marketing efforts</li>
                          <li>Team management delegation needs structure and clear processes</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="customer-relationship" className="space-y-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Customer Relationship Strength</h3>
                      <p>
                        Analysis of {report.company_name}'s customer relationships, retention metrics,
                        and strategies to enhance customer value as a critical component of exit valuation.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="border p-4 rounded-md">
                          <h4>Strengths</h4>
                          <ul>
                            <li>High Net Promoter Score (62)</li>
                            <li>Strong customer retention (87% annual)</li>
                            <li>Diversified customer base across industries</li>
                          </ul>
                        </div>
                        <div className="border p-4 rounded-md">
                          <h4>Improvement Areas</h4>
                          <ul>
                            <li>Customer success metrics documentation</li>
                            <li>Formalized feedback collection processes</li>
                            <li>Case studies highlighting ROI for key accounts</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recommendations" className="space-y-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Strategic Recommendations</h3>
                      <p>
                        Actionable recommendations for {report.company_name} to maximize exit value,
                        prioritized by impact and implementation timeline.
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
                  
                  <TabsContent value="readiness-scorecard" className="space-y-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Exit-Readiness Scorecard</h3>
                      <p>
                        Comprehensive assessment of {report.company_name}'s exit readiness across key dimensions,
                        with scores and priority improvement areas.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="border p-4 rounded-md">
                          <h4>Financial Readiness: 7/10</h4>
                          <ul>
                            <li>Strong recurring revenue model</li>
                            <li>Consistent profit margins</li>
                            <li>Needs improved financial documentation</li>
                          </ul>
                        </div>
                        <div className="border p-4 rounded-md">
                          <h4>Operational Readiness: 6/10</h4>
                          <ul>
                            <li>Good process documentation</li>
                            <li>Needs improved delegation structure</li>
                            <li>Technology stack well-maintained</li>
                          </ul>
                        </div>
                        <div className="border p-4 rounded-md">
                          <h4>Market Positioning: 8/10</h4>
                          <ul>
                            <li>Strong brand recognition in niche</li>
                            <li>Differentiated value proposition</li>
                            <li>Competitive advantage well-articulated</li>
                          </ul>
                        </div>
                        <div className="border p-4 rounded-md">
                          <h4>Leadership Transferability: 5/10</h4>
                          <ul>
                            <li>Too dependent on founder</li>
                            <li>Key decisions not delegated enough</li>
                            <li>Management team needs development</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resources" className="space-y-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <h3>Purposeful-Exit Quote & Resources</h3>
                      <blockquote className="italic border-l-4 border-primary pl-4 py-2 my-4">
                        "The best time to prepare for an exit is the day you start your business. 
                        The second best time is today."
                      </blockquote>
                      
                      <h4>Recommended Resources</h4>
                      <ul>
                        <li>
                          <strong>Book:</strong> Built to Sell: Creating a Business That Can Thrive Without You
                        </li>
                        <li>
                          <strong>Assessment:</strong> Value Builder System - Business Value Assessment
                        </li>
                        <li>
                          <strong>Expert Network:</strong> Exit Planning Institute - Find a Certified Exit Planning Advisor
                        </li>
                        <li>
                          <strong>Workshop:</strong> Strategic Value Advisory - Exit Readiness Workshop
                        </li>
                      </ul>
                      
                      <div className="bg-muted p-4 rounded-md mt-4">
                        <h4>Next Steps</h4>
                        <p>
                          Schedule a follow-up strategy session to prioritize exit-readiness actions and 
                          develop an implementation timeline customized for {report.company_name}'s goals.
                        </p>
                      </div>
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
