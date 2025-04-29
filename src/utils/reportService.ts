
import { supabase } from '@/integrations/supabase/client';

interface TabData {
  tabId: string;
  title: string;
  content: Record<string, any>;
}

interface ClientReportParams {
  companyName: string;
  exerciseId: string;
  tabs: TabData[];
  userId: string;
}

export const reportService = {
  /**
   * Save client report data
   */
  async saveReport(params: ClientReportParams) {
    try {
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
  async getReport(companyName: string, exerciseId: string) {
    try {
      // Use URL parameters in the body instead of query option
      const { data, error } = await supabase.functions.invoke('client-report', {
        method: 'GET',
        body: {
          company: companyName,
          exercise: exerciseId
        }
      });

      if (error) {
        console.error('Error fetching report:', error);
        throw new Error(error.message);
      }

      return data.report;
    } catch (err) {
      console.error('Error in getReport:', err);
      throw err;
    }
  }
};
