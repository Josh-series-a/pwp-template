
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
  companyName: string;
  exerciseId: string;
  tabs: TabData[];
  userId: string;
  reportId?: string; // Optional report ID for updates
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

  const { companyName, exerciseId, tabs, userId, reportId } = requestData;

  // If reportId is provided, try to update that specific report
  if (reportId) {
    console.log(`Attempting to update report with ID: ${reportId}`);
    
    // First fetch the existing report to properly merge the tabs data
    const { data: existingReport, error: fetchError } = await supabaseClient
      .from('reports')
      .select('tabs_data')
      .eq('id', reportId)
      .maybeSingle(); // Use maybeSingle instead of single to handle 0 or 1 rows
      
    if (fetchError) {
      console.error('Error fetching existing report:', fetchError);
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
    
    // Prepare the tabs data for update
    let updatedTabsData = tabs;
    
    // If there are existing tabs, merge the new tabs with existing ones
    if (existingReport && existingReport.tabs_data) {
      const existingTabs = existingReport.tabs_data;
      
      // For each new tab, either update an existing tab or add it as a new tab
      updatedTabsData = [...existingTabs];
      
      tabs.forEach(newTab => {
        const existingTabIndex = existingTabs.findIndex(
          (tab: TabData) => tab.tabId === newTab.tabId
        );
        
        if (existingTabIndex >= 0) {
          // Update existing tab
          updatedTabsData[existingTabIndex] = newTab;
        } else {
          // Add new tab
          updatedTabsData.push(newTab);
        }
      });
    }
    
    // Update the report with the merged tabs data
    const { error: updateError } = await supabaseClient
      .from('reports')
      .update({ 
        updated_at: new Date().toISOString(),
        tabs_data: updatedTabsData
      })
      .eq('id', reportId);
    
    if (updateError) {
      console.error('Error updating report by ID:', updateError);
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
        message: 'Report data updated successfully',
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

  // If no reportId provided, check if a report for this company/exercise exists
  const { data: existingReports, error: fetchError } = await supabaseClient
    .from('reports')
    .select('id, tabs_data')
    .eq('company_name', companyName)
    .eq('exercise_id', exerciseId);

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

  let reportId_response: string;
  
  // If report exists, update it, otherwise create new one
  if (existingReports && existingReports.length > 0) {
    reportId_response = existingReports[0].id;
    
    // Prepare tabs data by merging existing and new tabs
    let updatedTabsData = tabs;
    if (existingReports[0].tabs_data) {
      const existingTabs = existingReports[0].tabs_data;
      updatedTabsData = [...existingTabs];
      
      tabs.forEach(newTab => {
        const existingTabIndex = existingTabs.findIndex(
          (tab: TabData) => tab.tabId === newTab.tabId
        );
        
        if (existingTabIndex >= 0) {
          // Update existing tab
          updatedTabsData[existingTabIndex] = newTab;
        } else {
          // Add new tab
          updatedTabsData.push(newTab);
        }
      });
    }
    
    // Update the existing report
    const { error: updateError } = await supabaseClient
      .from('reports')
      .update({ 
        updated_at: new Date().toISOString(),
        tabs_data: updatedTabsData
      })
      .eq('id', reportId_response);

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
    
    reportId_response = newReport.id;
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Report data saved successfully',
      reportId: reportId_response
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
      .maybeSingle(); // Use maybeSingle instead of single to handle 0 or 1 rows

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
