
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Configure CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define the tab data structure
interface TabData {
  tabId: string;
  title: string;
  content: Record<string, any>;
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
  companyName: string;
  exerciseId: string;
  tabs: TabData[];
  userId: string;
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
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

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

  const { companyName, exerciseId, tabs, userId } = requestData;

  // First check if a report for this company/exercise exists
  const { data: existingReport, error: fetchError } = await supabaseClient
    .from('reports')
    .select('id')
    .eq('company_name', companyName)
    .eq('exercise_id', exerciseId)
    .limit(1);

  if (fetchError) {
    console.error('Error checking existing report:', fetchError);
    return new Response(
      JSON.stringify({ error: fetchError.message }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  let reportId: string;
  
  // If report exists, update it, otherwise create new one
  if (existingReport && existingReport.length > 0) {
    reportId = existingReport[0].id;
    
    // Update the existing report
    const { error: updateError } = await supabaseClient
      .from('reports')
      .update({ 
        updated_at: new Date().toISOString(),
        tabs_data: tabs
      })
      .eq('id', reportId);

    if (updateError) {
      console.error('Error updating report:', updateError);
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
  } else {
    // Create a new report
    const title = `${companyName} - ${exerciseId.replace(/-/g, ' ')}`;
    
    const { data: newReport, error: createError } = await supabaseClient
      .from('reports')
      .insert({
        user_id: userId,
        title: title,
        company_name: companyName,
        exercise_id: exerciseId,
        tabs_data: tabs,
        status: 'In Progress'
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating new report:', createError);
      return new Response(
        JSON.stringify({ error: createError.message }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
    
    reportId = newReport.id;
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Report data saved successfully',
      reportId
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

async function handleGetRequest(req: Request, supabaseClient: any) {
  let companyName: string | null = null;
  let exerciseId: string | null = null;

  // First try to get parameters from URL query string
  const url = new URL(req.url);
  companyName = url.searchParams.get('company');
  exerciseId = url.searchParams.get('exercise');

  // If not found in URL, try to get from request body
  if (!companyName || !exerciseId) {
    try {
      const body = await req.json();
      companyName = body.company || null;
      exerciseId = body.exercise || null;
    } catch (e) {
      console.error('Error parsing request body:', e);
      // Continue with null values if body parsing fails
    }
  }

  if (!companyName || !exerciseId) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameters: company and exercise' }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  // Get report data for the company and exercise
  const { data: report, error } = await supabaseClient
    .from('reports')
    .select('*')
    .eq('company_name', companyName)
    .eq('exercise_id', exerciseId)
    .limit(1)
    .maybeSingle();

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
