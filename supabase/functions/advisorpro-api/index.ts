import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, method = 'GET', body } = await req.json();
    
    console.log('AdvisorPro API request:', { endpoint, method });

    // Get the API key from environment
    const apiKey = Deno.env.get('ADVISORPRO_API_KEY');
    if (!apiKey) {
      console.error('ADVISORPRO_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Build the URL
    const baseUrl = 'https://api.advisorpro.ai/functions/v1/packages-api';
    let url: string;
    
    if (endpoint === 'create-package') {
      url = baseUrl;
    } else {
      url = `${baseUrl}/${endpoint}`;
    }

    console.log('Making request to:', url);

    // Make the API request
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    };

    if (method === 'POST' && body) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);
    const responseData = await response.json();

    console.log('AdvisorPro API response:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });

    // Return the response with CORS headers
    return new Response(
      JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in AdvisorPro API function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 500
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});