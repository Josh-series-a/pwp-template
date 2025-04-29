
import { supabase } from '@/integrations/supabase/client';

// Executive Snapshot specific types
interface KPI {
  label: string;
  current: number;
  target: number;
  unit?: string;
}

interface Risk {
  risk: string;
  severity: number;
}

interface UiComponent {
  type: string;
  bind: string;
  title?: string;
}

interface UiSchema {
  layout: string;
  components: UiComponent[];
}

// Generic tab data interface with type-specific fields
interface TabData {
  tabId: string;
  title: string;
  content?: Record<string, any>; // For backward compatibility
  clientId?: string;
  heroQuote?: string;
  kpis?: KPI[];
  topRisks?: Risk[];
  missionStatement?: string;
  uiSchema?: UiSchema;
}

interface ClientReportParams {
  companyName: string;
  exerciseId: string;
  tabs: TabData[];
  userId: string;
  reportId?: string; // Optional report ID for updates
}

export const reportService = {
  /**
   * Save client report data
   */
  async saveReport(params: ClientReportParams) {
    try {
      console.log('Saving report with params:', params);
      const { data, error } = await supabase.functions.invoke('client-report', {
        method: 'POST',
        body: params
      });

      if (error) {
        console.error('Error saving report:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.error('Error in saveReport:', err);
      throw err;
    }
  },

  /**
   * Get client report data
   */
  async getReport(companyName: string, exerciseId: string, reportId?: string) {
    try {
      console.log(`Getting report: company=${companyName}, exercise=${exerciseId}, reportId=${reportId || 'none'}`);
      
      // Build URL with query parameters instead of using body for GET requests
      let url = `client-report?company=${encodeURIComponent(companyName)}&exercise=${encodeURIComponent(exerciseId)}`;
      
      // Add reportId to URL if provided
      if (reportId) {
        url += `&reportId=${encodeURIComponent(reportId)}`;
      }
      
      const { data, error } = await supabase.functions.invoke(url, {
        method: 'GET'
      });

      if (error) {
        console.error('Error fetching report:', error);
        throw new Error(error.message);
      }

      console.log('Report data received:', data);
      return data.report;
    } catch (err) {
      console.error('Error in getReport:', err);
      throw err;
    }
  },

  /**
   * Save Executive Snapshot tab data
   */
  async saveExecutiveSnapshot(
    companyName: string,
    exerciseId: string,
    userId: string,
    snapshotData: {
      clientId: string;
      heroQuote: string;
      kpis: KPI[];
      topRisks: Risk[];
      missionStatement: string;
      uiSchema: UiSchema;
    },
    reportId?: string // Add optional reportId parameter
  ) {
    const tabData: TabData = {
      tabId: 'executiveSnapshot',
      title: 'Executive Snapshot',
      ...snapshotData
    };

    return this.saveReport({
      companyName,
      exerciseId,
      tabs: [tabData],
      userId,
      reportId // Include reportId in the params
    });
  }
};
