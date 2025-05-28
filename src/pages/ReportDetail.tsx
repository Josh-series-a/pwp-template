
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Target, Users, DollarSign, Heart, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { reportService } from '@/utils/reportService';

const ReportDetail = () => {
  const { companySlug, exerciseId, reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plan');

  useEffect(() => {
    const fetchReportData = async () => {
      if (!companySlug || !exerciseId || !reportId) return;
      
      setIsLoading(true);
      try {
        // First get basic report info from Supabase
        const { data: reportData, error } = await supabase
          .from('reports')
          .select('*')
          .eq('id', reportId)
          .single();
        
        if (error) throw error;
        
        if (reportData) {
          setReport(reportData);
          
          // Try to get detailed report data from the service
          try {
            const detailedReport = await reportService.getReport(
              reportData.company_name, 
              exerciseId, 
              reportId
            );
            setReport({ ...reportData, ...detailedReport });
          } catch (serviceError) {
            console.log('Detailed report data not available, using basic data');
          }
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [companySlug, exerciseId, reportId]);

  if (isLoading) {
    return (
      <DashboardLayout title="Loading Report...">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading report details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const reportTitle = report?.title || 'Report Details';
  const companyName = report?.company_name || 'Unknown Company';

  return (
    <DashboardLayout title={reportTitle}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard/reports')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reports
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{reportTitle}</span>
            </CardTitle>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Company: {companyName}</span>
              {report?.created_at && (
                <span>Generated: {new Date(report.created_at).toLocaleDateString()}</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="plan" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Plan
                </TabsTrigger>
                <TabsTrigger value="people" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  People
                </TabsTrigger>
                <TabsTrigger value="profits" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Profits
                </TabsTrigger>
                <TabsTrigger value="purpose" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Purpose & Impact
                </TabsTrigger>
                <TabsTrigger value="stress" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Stress & Leadership
                </TabsTrigger>
              </TabsList>

              <TabsContent value="plan" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Strategic Planning & Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Business Strategy</h4>
                        <p className="text-muted-foreground">
                          Strategic planning insights and recommendations will appear here based on your business health analysis.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Goal Setting</h4>
                        <p className="text-muted-foreground">
                          SMART goals and objectives aligned with your business vision.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Action Items</h4>
                        <p className="text-muted-foreground">
                          Prioritized action items to improve your business planning.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="people" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      People & Team Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Team Structure</h4>
                        <p className="text-muted-foreground">
                          Analysis of your current team structure and organizational effectiveness.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Hiring & Retention</h4>
                        <p className="text-muted-foreground">
                          Recommendations for talent acquisition and employee retention strategies.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Performance Management</h4>
                        <p className="text-muted-foreground">
                          Systems and processes for managing team performance and development.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profits" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-yellow-600" />
                      Financial Performance & Profitability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Revenue Analysis</h4>
                        <p className="text-muted-foreground">
                          Revenue streams analysis and optimization opportunities.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Cost Management</h4>
                        <p className="text-muted-foreground">
                          Cost structure analysis and efficiency improvements.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Profit Optimization</h4>
                        <p className="text-muted-foreground">
                          Strategies to improve profit margins and financial sustainability.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="purpose" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-purple-600" />
                      Purpose, Values & Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Mission & Vision</h4>
                        <p className="text-muted-foreground">
                          Assessment of your company mission, vision, and core values alignment.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Social Impact</h4>
                        <p className="text-muted-foreground">
                          Analysis of your business impact on community and stakeholders.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Sustainability</h4>
                        <p className="text-muted-foreground">
                          Environmental and social sustainability practices and opportunities.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stress" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-red-600" />
                      Stress Management & Leadership
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Leadership Assessment</h4>
                        <p className="text-muted-foreground">
                          Analysis of leadership effectiveness and areas for development.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Stress Factors</h4>
                        <p className="text-muted-foreground">
                          Identification of key stress factors affecting business performance.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Work-Life Balance</h4>
                        <p className="text-muted-foreground">
                          Recommendations for maintaining healthy work-life balance and preventing burnout.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReportDetail;
