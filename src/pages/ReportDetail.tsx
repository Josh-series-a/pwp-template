
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Target, Users, DollarSign, Heart, Brain, Package, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { reportService } from '@/utils/reportService';
import PackagesCarousel from '@/components/PackagesCarousel';

interface SubPillar {
  Name: string;
  Key_Question: string;
  Signals_to_Look_For: string[];
  Red_Flags: string[];
  Scoring_Guidance: Record<string, string>;
  Score: number;
}

interface BusinessHealthData {
  id: string;
  client_id: string;
  tab_id: string;
  overview: string | null;
  purpose: string | null;
  sub_pillars: any; // Changed from SubPillar[] to any to match Json type
  total_score: number | null;
  created_at: string;
  updated_at: string;
}

const ReportDetail = () => {
  const { companySlug, exerciseId, reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [businessHealthData, setBusinessHealthData] = useState<Record<string, BusinessHealthData>>({});
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
          
          // Fetch business health data for this client
          const { data: healthData, error: healthError } = await supabase
            .from('business_health')
            .select('*')
            .eq('client_id', reportId);
          
          if (healthError) {
            console.error('Error fetching business health data:', healthError);
          } else if (healthData) {
            // Organize data by tab_id
            const organizedData: Record<string, BusinessHealthData> = {};
            healthData.forEach((item) => {
              organizedData[item.tab_id] = item as BusinessHealthData;
            });
            setBusinessHealthData(organizedData);
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

  const renderSubPillars = (subPillars: any) => {
    // Safely parse subPillars if it's a string or already an array
    let pillarsArray: SubPillar[] = [];
    
    if (Array.isArray(subPillars)) {
      pillarsArray = subPillars;
    } else if (typeof subPillars === 'string') {
      try {
        pillarsArray = JSON.parse(subPillars);
      } catch (e) {
        console.error('Error parsing sub_pillars:', e);
        return <p className="text-muted-foreground">Error loading assessment data.</p>;
      }
    } else if (subPillars && typeof subPillars === 'object') {
      pillarsArray = subPillars;
    }

    if (!pillarsArray || pillarsArray.length === 0) {
      return <p className="text-muted-foreground">No assessment data available for this pillar.</p>;
    }

    return (
      <div className="space-y-6">
        {pillarsArray.map((pillar, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-lg">{pillar.Name}</h4>
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                Score: {pillar.Score}/10
              </div>
            </div>
            
            <div className="mb-3">
              <p className="font-medium text-blue-700 mb-1">Key Question:</p>
              <p className="text-sm">{pillar.Key_Question}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-green-700 mb-2">Signals to Look For:</p>
                <ul className="text-sm space-y-1">
                  {pillar.Signals_to_Look_For?.map((signal, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="font-medium text-red-700 mb-2">Red Flags:</p>
                <ul className="text-sm space-y-1">
                  {pillar.Red_Flags?.map((flag, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-red-600 mr-2">⚠</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-medium mb-2">Scoring Guidance:</p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                {Object.entries(pillar.Scoring_Guidance || {}).map(([range, description]) => (
                  <div key={range} className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">{range}</div>
                    <div className="text-gray-600">{description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = (tabId: string, defaultTitle: string, defaultDescription: string) => {
    const tabData = businessHealthData[tabId];
    
    if (!tabData) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{defaultTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{defaultDescription}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {defaultTitle}
              {tabData.total_score && (
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full">
                  Overall Score: {tabData.total_score}/10
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tabData.overview && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Overview</h4>
                <p className="text-muted-foreground">{tabData.overview}</p>
              </div>
            )}
            
            {tabData.purpose && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Purpose</h4>
                <p className="text-muted-foreground">{tabData.purpose}</p>
              </div>
            )}
            
            {renderSubPillars(tabData.sub_pillars)}
          </CardContent>
        </Card>
      </div>
    );
  };

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
              <TabsList className="grid w-full grid-cols-6">
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
                <TabsTrigger value="purposeImpact" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Purpose & Impact
                </TabsTrigger>
                <TabsTrigger value="stress_leadership" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Stress & Leadership
                </TabsTrigger>
                <TabsTrigger value="packages" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Packages
                </TabsTrigger>
              </TabsList>

              <TabsContent value="plan" className="mt-6">
                {renderTabContent('plan', 'Strategic Planning & Goals', 'Strategic planning insights and recommendations based on your business health analysis.')}
              </TabsContent>

              <TabsContent value="people" className="mt-6">
                {renderTabContent('people', 'People & Team Management', 'Analysis of your current team structure and organizational effectiveness.')}
              </TabsContent>

              <TabsContent value="profits" className="mt-6">
                {renderTabContent('profits', 'Financial Performance & Profitability', 'Revenue streams analysis and optimization opportunities.')}
              </TabsContent>

              <TabsContent value="purposeImpact" className="mt-6">
                {renderTabContent('purposeImpact', 'Purpose, Values & Impact', 'Assessment of your company mission, vision, and core values alignment.')}
              </TabsContent>

              <TabsContent value="stress_leadership" className="mt-6">
                {renderTabContent('stress_leadership', 'Stress Management & Leadership', 'Analysis of leadership effectiveness and stress management strategies.')}
              </TabsContent>

              <TabsContent value="packages" className="mt-6">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Button className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Generate Package
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                  <PackagesCarousel />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReportDetail;
