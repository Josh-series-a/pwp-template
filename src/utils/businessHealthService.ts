
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
      console.log('=== BUSINESS HEALTH SERVICE START ===');
      console.log('Service received params:', params);
      console.log('Params type check:');
      console.log('- clientId:', params.clientId, 'type:', typeof params.clientId);
      console.log('- tabId:', params.tabId, 'type:', typeof params.tabId);
      console.log('- reportId:', params.reportId, 'type:', typeof params.reportId);
      
      const requestBody = {
        clientId: params.clientId,
        tabId: params.tabId,
        reportId: params.reportId,
        Overview: params.Overview,
        Purpose: params.Purpose,
        Sub_Pillars: params.Sub_Pillars,
        Total_Score: params.Total_Score,
        Recommended_CIKs: params.Recommended_CIKs
      };

      console.log('=== ABOUT TO INVOKE SUPABASE FUNCTION ===');
      console.log('Request body to send:', requestBody);
      console.log('Request body JSON:', JSON.stringify(requestBody, null, 2));
      
      const { data, error } = await supabase.functions.invoke('business-health', {
        method: 'POST',
        body: requestBody
      });

      console.log('=== SUPABASE FUNCTION RESPONSE ===');
      console.log('Response data:', data);
      console.log('Response error:', error);

      if (error) {
        console.error('Error saving business health data:', error);
        throw new Error(error.message);
      }

      console.log('Business health data saved successfully:', data);
      return data;
    } catch (err) {
      console.error('=== ERROR IN BUSINESS HEALTH SERVICE ===');
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
