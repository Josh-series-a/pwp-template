import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Users, DollarSign, Heart, Brain, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import CreatePackageDialog from '@/components/reports/CreatePackageDialog';
import ReportHeader from '@/components/reports/ReportHeader';
import ReportLoadingState from '@/components/reports/ReportLoadingState';
import ReportTabContent from '@/components/reports/ReportTabContent';
import PackagesTab from '@/components/reports/PackagesTab';

interface BusinessHealthData {
  id: string;
  client_id: string;
  tab_id: string;
  report_id: string | null;
  overview: string | null;
  purpose: string | null;
  sub_pillars: any;
  total_score: number | null;
  created_at: string;
  updated_at: string;
  recommended_ciks?: string[];
}

const ReportDetail = () => {
  const { companySlug, exerciseId, reportId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [report, setReport] = useState<any>(null);
  const [businessHealthData, setBusinessHealthData] = useState<Record<string, BusinessHealthData>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Get active tab from URL params or default to 'plan'
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'plan');
  const [packagesCIKs, setPackagesCIKs] = useState<string[]>([]);
  const [isCreatePackageDialogOpen, setIsCreatePackageDialogOpen] = useState(false);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', newTab);
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    const fetchReportData = async () => {
      if (!companySlug || !exerciseId || !reportId) return;
      
      setIsLoading(true);
      try {
        console.log('Fetching data for reportId:', reportId);
        
        // First get basic report info from Supabase
        const { data: reportData, error } = await supabase
          .from('reports')
          .select('*')
          .eq('id', reportId)
          .single();
        
        if (error) {
          console.error('Error fetching report:', error);
          throw error;
        }
        
        if (reportData) {
          console.log('Report data found:', reportData);
          setReport(reportData);
          
          // Try to get business health data from our database first
          const { data: businessHealthRows, error: businessHealthError } = await supabase
            .from('business_health')
            .select('*')
            .eq('report_id', reportId);
          
          if (businessHealthError) {
            console.error('Error fetching business health from database:', businessHealthError);
          }
          
          if (businessHealthRows && businessHealthRows.length > 0) {
            console.log('Found business health data in database:', businessHealthRows);
            
            // Organize data by tab_id with mapping for stress leadership
            const organizedData: Record<string, BusinessHealthData> = {};
            const allCIKs = new Set<string>();
            
            businessHealthRows.forEach((item: any) => {
              // Map stressLeadership to stress_leadership for frontend compatibility
              const tabKey = item.tab_id === 'stressLeadership' ? 'stress_leadership' : item.tab_id;
              organizedData[tabKey] = item;
              
              // Collect all CIKs for packages tab
              if (item.recommended_ciks && Array.isArray(item.recommended_ciks)) {
                item.recommended_ciks.forEach((cik: string) => allCIKs.add(cik));
              }
            });
            
            setBusinessHealthData(organizedData);
            setPackagesCIKs(Array.from(allCIKs));
            console.log('Organized business health data:', organizedData);
          } else {
            console.log('No business health data found in database, trying edge function...');
            
            // Fallback to edge function
            const healthUrl = `https://eiksxjzbwzujepqgmxsp.supabase.co/functions/v1/business-health?reportId=${reportId}`;
            
            const healthFetch = await fetch(healthUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa3N4anpid3p1amVwcWdteHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTk4NTMsImV4cCI6MjA1ODM5NTg1M30.8DC-2c-QaqQlGbwrw2bNutDfTJYFFEPtPbzhWobZOLY`,
                'Content-Type': 'application/json',
              },
            });
            
            const healthData = await healthFetch.json();
            console.log('Edge function response:', healthData);
            
            if (healthData?.success && healthData?.data && healthData.data.length > 0) {
              // Organize data by tab_id with mapping for stress leadership
              const organizedData: Record<string, BusinessHealthData> = {};
              const allCIKs = new Set<string>();
              
              healthData.data.forEach((item: BusinessHealthData) => {
                // Map stressLeadership to stress_leadership for frontend compatibility
                const tabKey = item.tab_id === 'stressLeadership' ? 'stress_leadership' : item.tab_id;
                organizedData[tabKey] = item;
                
                // Collect all CIKs for packages tab
                if (item.recommended_ciks && Array.isArray(item.recommended_ciks)) {
                  item.recommended_ciks.forEach((cik: string) => allCIKs.add(cik));
                }
              });
              setBusinessHealthData(organizedData);
              setPackagesCIKs(Array.from(allCIKs));
              console.log('Fetched business health data from edge function:', organizedData);
            } else {
              console.log('No business health data found in edge function response');
              toast.error('No business health analysis data found for this report. The analysis may still be in progress.');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        toast.error('Failed to load report details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [companySlug, exerciseId, reportId]);

  if (isLoading) {
    return <ReportLoadingState />;
  }

  const reportTitle = report?.title || 'Report Details';
  const companyName = report?.company_name || 'Unknown Company';

  return (
    <DashboardLayout title={reportTitle}>
      <div className="space-y-6">
        <ReportHeader
          reportTitle={reportTitle}
          companyName={companyName}
          createdAt={report?.created_at}
          onBackClick={() => navigate('/dashboard/reports')}
          onCreatePackageClick={() => setIsCreatePackageDialogOpen(true)}
        />

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading report details...</p>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                <ReportTabContent
                  tabId="plan"
                  defaultTitle="Strategic Planning & Goals"
                  defaultDescription="Strategic planning insights and recommendations based on your business health analysis."
                  businessHealthData={businessHealthData}
                />
              </TabsContent>

              <TabsContent value="people" className="mt-6">
                <ReportTabContent
                  tabId="people"
                  defaultTitle="People & Team Management"
                  defaultDescription="Analysis of your current team structure and organizational effectiveness."
                  businessHealthData={businessHealthData}
                />
              </TabsContent>

              <TabsContent value="profits" className="mt-6">
                <ReportTabContent
                  tabId="profits"
                  defaultTitle="Financial Performance & Profitability"
                  defaultDescription="Revenue streams analysis and optimization opportunities."
                  businessHealthData={businessHealthData}
                />
              </TabsContent>

              <TabsContent value="purposeImpact" className="mt-6">
                <ReportTabContent
                  tabId="purposeImpact"
                  defaultTitle="Purpose, Values & Impact"
                  defaultDescription="Assessment of your company mission, vision, and core values alignment."
                  businessHealthData={businessHealthData}
                />
              </TabsContent>

              <TabsContent value="stress_leadership" className="mt-6">
                <ReportTabContent
                  tabId="stress_leadership"
                  defaultTitle="Stress Management & Leadership"
                  defaultDescription="Analysis of leadership effectiveness and stress management strategies."
                  businessHealthData={businessHealthData}
                />
              </TabsContent>

              <TabsContent value="packages" className="mt-6">
                <PackagesTab
                  reportId={reportId || ''}
                  packagesCIKs={packagesCIKs}
                  report={report}
                  user={user}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </div>

      <CreatePackageDialog 
        isOpen={isCreatePackageDialogOpen}
        onClose={() => setIsCreatePackageDialogOpen(false)}
        preSelectedCompany={companyName}
        reportId={reportId}
        statusType={report?.status_type}
        companyId={report?.company_id}
      />
    </DashboardLayout>
  );
};

export default ReportDetail;
