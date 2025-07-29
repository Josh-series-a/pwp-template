const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[BUSINESS-HEALTH-SUBMISSION] Function started');

    // Parse the request body
    const payload = await req.json();
    console.log('[BUSINESS-HEALTH-SUBMISSION] Payload received:', {
      companyName: payload.companyName,
      userId: payload.userId
    });

    // Validate required fields
    if (!payload.companyName) {
      console.error('[BUSINESS-HEALTH-SUBMISSION] Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the AdvisorPro API key
    const advisorProApiKey = Deno.env.get('AdvisorPro_Labs');
    if (!advisorProApiKey) {
      console.error('[BUSINESS-HEALTH-SUBMISSION] AdvisorPro API key not found');
      return new Response(
        JSON.stringify({ error: 'AdvisorPro API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Submit to AdvisorPro API
    console.log('[BUSINESS-HEALTH-SUBMISSION] Submitting to AdvisorPro API...');
    
    // Create payload with only required fields
    const advisorProPayload = {
      companyName: payload.companyName,
      userId: payload.userId,
      client_id: payload.reportId,
      webhook_url: 'https://hook.eu2.make.com/dfy1e9marxrcpg6aw0x6ocf4bd9nosbt'
    };
    
    console.log('[BUSINESS-HEALTH-SUBMISSION] Full payload:', JSON.stringify(advisorProPayload, null, 2));
    
    const advisorProResponse = await fetch('https://api.advisorpro.ai/functions/v1/packages-api/new-client-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': advisorProApiKey,
      },
      body: JSON.stringify(advisorProPayload),
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
    console.error('[BUSINESS-HEALTH-SUBMISSION] Error details:', error.message);
    console.error('[BUSINESS-HEALTH-SUBMISSION] Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        stack: error.stack 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});