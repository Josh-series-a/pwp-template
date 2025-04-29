
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

// KPI Interface
interface KPI {
  label: string;
  current: number;
  target: number;
  unit?: string;
}

// Risk Interface
interface Risk {
  risk: string;
  severity: number;
}

const ReportDetail = () => {
  const { companySlug, exerciseId, reportId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [executiveTabData, setExecutiveTabData] = useState<any | null>(null);
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key state

  // Function to trigger data refresh
  const refreshData = () => {
    setRefreshKey(prevKey => prevKey + 1); // Increment refresh key to trigger useEffect
  };

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
            console.log("Processing tabs data:", reportData.tabs_data);
            
            // Find the executive snapshot tab data
            const executiveTab = reportData.tabs_data.find((tab: any) => 
              tab.tabId === 'executiveSnapshot' || tab.tabId === 'executive-snapshot'
            );
            
            if (executiveTab) {
              console.log("Found executive tab data:", executiveTab);
              setExecutiveTabData(executiveTab);
            } else {
              console.log("No executive tab found in tabs_data");
              setExecutiveTabData(null); // Reset to null if no executive tab is found
            }
          } else {
            // Reset executive tab data if no tabs data is found
            setExecutiveTabData(null);
          }
          setIsLoading(false);
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
  }, [companySlug, exerciseId, reportId, toast, navigate, refreshKey]); // Add refreshKey dependency

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
      
      // Example executive snapshot data - in a real app you would collect this from the UI
      const executiveSnapshotData = {
        clientId: userId,
        heroQuote: "Building business value today for greater returns tomorrow",
        kpis: [
          { label: "Annual Revenue", current: 1200000, target: 2000000, unit: "$" },
          { label: "Customer Retention", current: 87, target: 95, unit: "%" },
          { label: "Market Share", current: 12, target: 20, unit: "%" }
        ],
        topRisks: [
          { risk: "Market competition", severity: 4 },
          { risk: "Technology disruption", severity: 3 },
          { risk: "Talent retention", severity: 4 }
        ],
        missionStatement: "To create innovative solutions that deliver measurable value to our customers",
        uiSchema: {
          layout: "twoColumn",
          components: [
            { type: "QuoteBanner", bind: "heroQuote" },
            { type: "KPIGrid", bind: "kpis" },
            { type: "RiskMeter", title: "Top Exit Risks", bind: "topRisks" },
            { type: "Paragraph", title: "Mission", bind: "missionStatement" }
          ]
        }
      };
      
      const result = await reportService.saveExecutiveSnapshot(
        companyName,
        exerciseId,
        userId,
        executiveSnapshotData,
        reportId
      );
      
      toast({
        title: "Success",
        description: "Report data saved successfully",
      });
      
      console.log('Saved report data:', result);
      
      // Instead of full page reload, use the refresh function to update data
      refreshData();
      
    } catch (error: any) {
      console.error('Error saving tab data:', error);
      toast({
        title: "Error",
        description: `Failed to save report data: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  // Render KPI component
  const renderKPI = (kpi: KPI) => {
    // Calculate percentage of target achieved
    const percentage = Math.min(Math.round((kpi.current / kpi.target) * 100), 100);
    
    return (
      <div key={kpi.label} className="bg-card border rounded-md p-4">
        <h3 className="font-medium text-sm mb-1">{kpi.label}</h3>
        <div className="flex justify-between text-sm mb-1">
          <span>Current: {kpi.current.toLocaleString()}{kpi.unit || ''}</span>
          <span>Target: {kpi.target.toLocaleString()}{kpi.unit || ''}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 mb-1">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-right text-muted-foreground">{percentage}% of target</div>
      </div>
    );
  };

  // Render risk meter
  const renderRisk = (risk: Risk) => {
    // Define color based on severity (1-5)
    const colors = [
      'bg-green-500',    // 1 - Low
      'bg-yellow-400',   // 2 - Medium-Low
      'bg-yellow-500',   // 3 - Medium
      'bg-orange-500',   // 4 - Medium-High
      'bg-red-500'       // 5 - High
    ];
    
    const color = colors[Math.min(risk.severity - 1, 4)];
    
    return (
      <div key={risk.risk} className="flex items-center space-x-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <div className="flex-1">{risk.risk}</div>
        <div className="text-sm font-medium">{risk.severity}/5</div>
      </div>
    );
  };

  const renderEmptyTabContent = (tabTitle: string) => (
    <div className="prose max-w-none dark:prose-invert">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
        <p className="text-sm text-muted-foreground">
          No data available for the {tabTitle} tab.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Please use the "Re-analyze" button to generate tab content.
        </p>
      </div>
    </div>
  );

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
                      {executiveTabData?.heroQuote && (
                        <div className="bg-muted p-4 my-4 border-l-4 border-primary italic">
                          "{executiveTabData.heroQuote}"
                        </div>
                      )}
                      
                      <h3>Executive Snapshot</h3>
                      <p>
                        Overview of {report.company_name}'s current exit readiness positioning and key metrics
                        that executives should focus on to maximize value in a potential acquisition.
                      </p>
                      
                      {executiveTabData?.missionStatement && (
                        <div className="mt-4">
                          <h4>Mission Statement</h4>
                          <p>{executiveTabData.missionStatement}</p>
                        </div>
                      )}
                      
                      {executiveTabData?.kpis && executiveTabData.kpis.length > 0 && (
                        <div className="mt-6">
                          <h4>Key Performance Indicators</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                            {executiveTabData.kpis.map((kpi: KPI) => renderKPI(kpi))}
                          </div>
                        </div>
                      )}
                      
                      {executiveTabData?.topRisks && executiveTabData.topRisks.length > 0 && (
                        <div className="mt-6">
                          <h4>Top Exit Risks</h4>
                          <div className="bg-card border rounded-md p-4 mt-2">
                            {executiveTabData.topRisks.map((risk: Risk) => renderRisk(risk))}
                          </div>
                        </div>
                      )}
                      
                      {!executiveTabData && (
                        <div className="mt-4">
                          {renderEmptyTabContent("Executive Snapshot")}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="exit-destination" className="space-y-4">
                    {renderEmptyTabContent("Exit Destination")}
                  </TabsContent>
                  
                  <TabsContent value="ideal-buyers" className="space-y-4">
                    {renderEmptyTabContent("Ideal Buyers")}
                  </TabsContent>
                  
                  <TabsContent value="exit-proposition" className="space-y-4">
                    {renderEmptyTabContent("'1 + 1' Exit Proposition")}
                  </TabsContent>
                  
                  <TabsContent value="leadership-delegation" className="space-y-4">
                    {renderEmptyTabContent("Leadership & Delegation")}
                  </TabsContent>
                  
                  <TabsContent value="customer-relationship" className="space-y-4">
                    {renderEmptyTabContent("Customer Relationship")}
                  </TabsContent>
                  
                  <TabsContent value="recommendations" className="space-y-4">
                    {renderEmptyTabContent("Strategic Recommendations")}
                  </TabsContent>
                  
                  <TabsContent value="readiness-scorecard" className="space-y-4">
                    {renderEmptyTabContent("Exit-Readiness Scorecard")}
                  </TabsContent>
                  
                  <TabsContent value="resources" className="space-y-4">
                    {renderEmptyTabContent("Purposeful-Exit Resources")}
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
