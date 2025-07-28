import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BusinessHealthPayload {
  companyName: string;
  contactName: string;
  fromExisting: boolean;
  reportId: string;
  originalCompanyId?: string;
  companyType: string;
  exerciseId: string;
  exerciseTitle: string;
  rawData: any;
  responses: string;
  userId: string;
  userEmail: string;
  businessDocUrl?: string;
  submittedAt: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[BUSINESS-HEALTH-SUBMISSION] Function started');

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('[BUSINESS-HEALTH-SUBMISSION] No authorization header');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('[BUSINESS-HEALTH-SUBMISSION] Authorization header found');

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('[BUSINESS-HEALTH-SUBMISSION] Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`[BUSINESS-HEALTH-SUBMISSION] User authenticated - ${user.email}`);

    // Parse the request body
    const payload: BusinessHealthPayload = await req.json();
    console.log('[BUSINESS-HEALTH-SUBMISSION] Payload received:', {
      companyName: payload.companyName,
      exerciseTitle: payload.exerciseTitle,
      userId: payload.userId
    });

    // Validate required fields
    if (!payload.companyName || !payload.exerciseTitle || !payload.responses) {
      console.error('[BUSINESS-HEALTH-SUBMISSION] Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Submit to AdvisorPro API
    console.log('[BUSINESS-HEALTH-SUBMISSION] Submitting to AdvisorPro API...');
    console.log('[BUSINESS-HEALTH-SUBMISSION] Full payload:', JSON.stringify(payload, null, 2));
    
    const advisorProResponse = await fetch('https://api.advisorpro.ai/functions/v1/packages-api/new-client-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('[BUSINESS-HEALTH-SUBMISSION] AdvisorPro API response status:', advisorProResponse.status);

    if (!advisorProResponse.ok) {
      const errorText = await advisorProResponse.text();
      console.error('[BUSINESS-HEALTH-SUBMISSION] AdvisorPro API error:', {
        status: advisorProResponse.status,
        statusText: advisorProResponse.statusText,
        error: errorText
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to submit to AdvisorPro API',
          details: errorText,
          status: advisorProResponse.status
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const result = await advisorProResponse.json();
    console.log('[BUSINESS-HEALTH-SUBMISSION] AdvisorPro API success:', result);

    // Update the report status in the database if we have a reportId
    if (payload.reportId) {
      console.log('[BUSINESS-HEALTH-SUBMISSION] Updating report status for reportId:', payload.reportId);
      
      const { error: updateError } = await supabase
        .from('reports')
        .update({ 
          status: 'completed',
          completion_date: new Date().toISOString()
        })
        .eq('id', payload.reportId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('[BUSINESS-HEALTH-SUBMISSION] Failed to update report:', updateError);
        // Don't fail the whole request for this
      } else {
        console.log('[BUSINESS-HEALTH-SUBMISSION] Report status updated successfully');
      }
    }

    // Return success response
    console.log('[BUSINESS-HEALTH-SUBMISSION] Submission completed successfully');
    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        message: 'Business Health Score submitted successfully to AdvisorPro API'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[BUSINESS-HEALTH-SUBMISSION] Unexpected error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});