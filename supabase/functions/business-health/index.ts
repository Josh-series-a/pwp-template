
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SubPillar {
  Name: string;
  Key_Question: string;
  Signals_to_Look_For: string[];
  Red_Flags: string[];
  Scoring_Guidance: Record<string, string>;
  Score: number;
}

interface BusinessHealthData {
  clientId: string;
  tabId: string;
  Overview: string;
  Purpose: string;
  Sub_Pillars: SubPillar[];
  Total_Score: number;
  Recommended_CIKs?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const url = new URL(req.url);
    const method = req.method;

    if (method === 'POST') {
      // Save business health data
      const requestData: BusinessHealthData = await req.json();
      
      console.log('Received business health data:', JSON.stringify(requestData, null, 2));

      // Validate required fields
      if (!requestData.clientId || !requestData.tabId) {
        return new Response(
          JSON.stringify({ error: 'clientId and tabId are required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check if record already exists
      const { data: existingData, error: selectError } = await supabaseClient
        .from('business_health')
        .select('id')
        .eq('client_id', requestData.clientId)
        .eq('tab_id', requestData.tabId)
        .maybeSingle();

      if (selectError) {
        console.error('Error checking existing record:', selectError);
        return new Response(
          JSON.stringify({ error: 'Failed to check existing record' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const businessHealthRecord = {
        client_id: requestData.clientId,
        tab_id: requestData.tabId,
        overview: requestData.Overview || null,
        purpose: requestData.Purpose || null,
        sub_pillars: requestData.Sub_Pillars || [],
        total_score: requestData.Total_Score || null,
        recommended_ciks: requestData.Recommended_CIKs || null,
        updated_at: new Date().toISOString()
      };

      let result;
      
      if (existingData) {
        // Update existing record
        const { data, error } = await supabaseClient
          .from('business_health')
          .update(businessHealthRecord)
          .eq('client_id', requestData.clientId)
          .eq('tab_id', requestData.tabId)
          .select()
          .single();

        if (error) {
          console.error('Error updating business health data:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to update business health data' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        
        result = data;
        console.log('Updated business health record:', result);
      } else {
        // Insert new record
        const { data, error } = await supabaseClient
          .from('business_health')
          .insert(businessHealthRecord)
          .select()
          .single();

        if (error) {
          console.error('Error inserting business health data:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to save business health data' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        
        result = data;
        console.log('Inserted new business health record:', result);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: result,
          message: existingData ? 'Business health data updated successfully' : 'Business health data saved successfully'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else if (method === 'GET') {
      // Fetch business health data
      const clientId = url.searchParams.get('clientId');
      const tabId = url.searchParams.get('tabId');

      if (!clientId) {
        return new Response(
          JSON.stringify({ error: 'clientId parameter is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      let query = supabaseClient
        .from('business_health')
        .select('*')
        .eq('client_id', clientId);

      // If tabId is provided, filter by it as well
      if (tabId) {
        query = query.eq('tab_id', tabId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching business health data:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch business health data' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log(`Fetched ${data?.length || 0} business health records for clientId: ${clientId}${tabId ? `, tabId: ${tabId}` : ''}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data || [],
          count: data?.length || 0
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Unexpected error in business-health function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
