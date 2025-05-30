import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Configure CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, cache-control',
};

// Define the tab data structure
interface TabData {
  tabId: string;
  title: string;
  content?: Record<string, any>;
  clientId?: string;
  heroQuote?: string;
  kpis?: Array<{
    label: string;
    current: number;
    target: number;
    unit?: string;
  }>;
  topRisks?: Array<{
    risk: string;
    severity: number;
  }>;
  missionStatement?: string;
  uiSchema?: {
    layout: string;
    components: Array<{
      type: string;
      bind: string;
      title?: string;
    }>;
  };
}

interface ClientReportRequest {
  companyName?: string;
  exerciseId?: string;
  tabs?: TabData[];
  userId: string;
  reportId?: string;
  // New fields for score updates
  scores?: Record<string, number>;
  status?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    console.log('Client-report function called without auth requirement');

    // Handle different HTTP methods
    if (req.method === 'POST') {
      return await handlePostRequest(req, supabaseClient);
    } else if (req.method === 'GET') {
      return await handleGetRequest(req, supabaseClient);
    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      );
    }
  } catch (error) {
    console.error('Error in client-report function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});

async function handlePostRequest(req: Request, supabaseClient: any) {
  const requestData: ClientReportRequest = await req.json();
  console.log('Received report data:', requestData);

  const { companyName, exerciseId, tabs, userId, reportId, scores, status } = requestData;

  console.log('Using user ID from request:', userId);

  // Handle score-only updates (simpler path)
  if (reportId && scores) {
    console.log(`Updating scores for report ${reportId}`);
    
    // Check if the report exists
    const { data: existingReport, error: checkError } = await supabaseClient
      .from('reports')
      .select('id, user_id, title, company_name')
      .eq('id', reportId)
      .maybeSingle();
    
    console.log('Report lookup result:', existingReport);
    console.log('Report lookup error:', checkError);
    
    if (checkError) {
      console.error('Error checking report existence:', checkError);
      return new Response(
        JSON.stringify({ error: checkError.message }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
    
    if (!existingReport) {
      console.error('Report not found:', reportId);
      return new Response(
        JSON.stringify({ 
          error: 'Report not found',
          debug: {
            requestedId: reportId
          }
        }),
        { 
          status: 404, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    // Map scores to database columns
    if (scores.Score_Plan !== undefined) updateData.plan_score = scores.Score_Plan;
    if (scores.Score_People !== undefined) updateData.people_score = scores.Score_People;
    if (scores.Score_Profits !== undefined) updateData.profits_score = scores.Score_Profits;
    if (scores.Score_Purpose !== undefined) updateData.purpose_impact_score = scores.Score_Purpose;
    if (scores.Score_Leadership !== undefined) updateData.stress_leadership_score = scores.Score_Leadership;
    if (scores.Business_Health_Score !== undefined) updateData.overall_score = scores.Business_Health_Score;
    
    // Update status if provided
    if (status) {
      updateData.status = status;
      if (status === 'completed') {
        updateData.completion_date = new Date().toISOString();
      }
    }
    
    console.log('Update data:', updateData);
    
    const { data: updatedReport, error: updateError } = await supabaseClient
      .from('reports')
      .update(updateData)
      .eq('id', reportId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating report scores:', updateError);
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Report scores updated successfully',
        reportId,
        report: updatedReport
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  // ... keep existing code (original tab-based logic)
}

async function handleGetRequest(req: Request, supabaseClient: any) {
  // Parse URL to get query parameters
  const url = new URL(req.url);
  const companyName = url.searchParams.get('company');
  const exerciseId = url.searchParams.get('exercise');
  const reportId = url.searchParams.get('reportId');
  
  console.log(`GET request parameters: company=${companyName}, exercise=${exerciseId}, reportId=${reportId || 'none'}`);

  // If reportId is provided, use it to fetch the specific report
  if (reportId) {
    const { data: report, error } = await supabaseClient
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching report by ID:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
    
    // Ensure tabs_data is always an array
    if (report && !report.tabs_data) {
      report.tabs_data = [];
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        report 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  // If company and exercise are provided but no reportId, fetch by those parameters
  if (companyName && exerciseId) {
    // Get report data for the company and exercise
    const { data: reports, error } = await supabaseClient
      .from('reports')
      .select('*')
      .eq('company_name', companyName)
      .eq('exercise_id', exerciseId)
      .limit(1);

    if (error) {
      console.error('Error fetching report:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Return the first report or null if no reports match
    const report = reports && reports.length > 0 ? reports[0] : null;
    
    // Ensure tabs_data is always an array
    if (report && !report.tabs_data) {
      report.tabs_data = [];
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        report 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  return new Response(
    JSON.stringify({ error: 'Missing required parameters: company, exercise, or reportId' }),
    { 
      status: 400, 
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      } 
    }
  );
}
