
import { supabase } from '@/integrations/supabase/client';

interface BusinessHealthParams {
  clientId: string;
  tabId: string;
  reportId?: string;
  Overview: string;
  Purpose: string;
  Sub_Pillars: any[];
  Total_Score: number;
  Recommended_CIKs?: string[];
}

export const businessHealthService = {
  /**
   * Save business health assessment data
   */
  async saveBusinessHealth(params: BusinessHealthParams) {
    try {
      console.log('Saving business health assessment:', params);
      
      const { data, error } = await supabase.functions.invoke('business-health', {
        method: 'POST',
        body: {
          clientId: params.clientId,
          tabId: params.tabId,
          reportId: params.reportId,
          Overview: params.Overview,
          Purpose: params.Purpose,
          Sub_Pillars: params.Sub_Pillars,
          Total_Score: params.Total_Score,
          Recommended_CIKs: params.Recommended_CIKs
        }
      });

      if (error) {
        console.error('Error saving business health data:', error);
        throw new Error(error.message);
      }

      console.log('Business health data saved successfully:', data);
      return data;
    } catch (err) {
      console.error('Error in saveBusinessHealth:', err);
      throw err;
    }
  },

  /**
   * Get business health assessment data
   */
  async getBusinessHealth(clientId: string, tabId?: string, reportId?: string) {
    try {
      console.log(`Getting business health data: clientId=${clientId}, tabId=${tabId || 'none'}, reportId=${reportId || 'none'}`);
      
      let url = `business-health?clientId=${encodeURIComponent(clientId)}`;
      
      if (tabId) {
        url += `&tabId=${encodeURIComponent(tabId)}`;
      }
      
      if (reportId) {
        url += `&reportId=${encodeURIComponent(reportId)}`;
      }
      
      const { data, error } = await supabase.functions.invoke(url, {
        method: 'GET'
      });

      if (error) {
        console.error('Error fetching business health data:', error);
        throw new Error(error.message);
      }

      console.log('Business health data retrieved:', data);
      return data;
    } catch (err) {
      console.error('Error in getBusinessHealth:', err);
      throw err;
    }
  },

  /**
   * Update report scores after business health assessment
   */
  async updateReportScores(reportId: string, scores: Record<string, number>, status?: string) {
    try {
      console.log(`Updating report scores for reportId: ${reportId}`, scores);
      
      const { data, error } = await supabase.functions.invoke('client-report', {
        method: 'POST',
        body: {
          reportId,
          scores,
          status
        }
      });

      if (error) {
        console.error('Error updating report scores:', error);
        throw new Error(error.message);
      }

      console.log('Report scores updated successfully:', data);
      return data;
    } catch (err) {
      console.error('Error in updateReportScores:', err);
      throw err;
    }
  }
};
