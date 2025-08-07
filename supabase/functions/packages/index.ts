
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Configure CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
};

interface Document {
  name: string;
  document: string[];
}

interface PackageRequest {
  reportId: string;
  package_name: string;
  documents: Document[];
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

    if (req.method === 'POST') {
      return await handleCreatePackage(req, supabaseClient);
    } else if (req.method === 'GET') {
      return await handleGetPackages(req, supabaseClient);
    } else if (req.method === 'DELETE') {
      return await handleDeletePackage(req, supabaseClient);
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
    console.error('Error in packages function:', error);
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

async function handleCreatePackage(req: Request, supabaseClient: any) {
  const requestData: PackageRequest = await req.json();
  console.log('Received package data:', requestData);

  const { reportId, package_name, documents } = requestData;

  // Validate required fields
  if (!reportId || !package_name) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: reportId, package_name' }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  // Verify the report exists
  const { data: report, error: reportError } = await supabaseClient
    .from('reports')
    .select('id, user_id')
    .eq('id', reportId)
    .single();

  if (reportError || !report) {
    return new Response(
      JSON.stringify({ error: 'Report not found' }),
      { 
        status: 404, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  // Create the package
  const { data: packageData, error: packageError } = await supabaseClient
    .from('packages')
    .insert({
      user_id: report.user_id,
      report_id: reportId,
      package_name,
      documents: documents || []
    })
    .select()
    .single();

  if (packageError) {
    console.error('Error creating package:', packageError);
    return new Response(
      JSON.stringify({ error: 'Failed to create package' }),
      { 
        status: 500, 
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
      message: 'Package created successfully',
      package: packageData
    }),
    { 
      status: 201, 
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      } 
    }
  );
}

async function handleGetPackages(req: Request, supabaseClient: any) {
  const url = new URL(req.url);
  const reportId = url.searchParams.get('reportId');

  if (!reportId) {
    return new Response(
      JSON.stringify({ error: 'Missing reportId parameter' }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  const { data: packages, error } = await supabaseClient
    .from('packages')
    .select('*')
    .eq('report_id', reportId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching packages:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch packages' }),
      { 
        status: 500, 
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
      packages: packages || [] 
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

async function handleDeletePackage(req: Request, supabaseClient: any) {
  const url = new URL(req.url);
  const packageId = url.searchParams.get('packageId');

  if (!packageId) {
    return new Response(
      JSON.stringify({ error: 'Missing packageId parameter' }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  const { data, error } = await supabaseClient
    .from('packages')
    .delete()
    .eq('id', packageId)
    .select()
    .single();

  if (error) {
    console.error('Error deleting package:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete package' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  if (!data) {
    return new Response(
      JSON.stringify({ error: 'Package not found' }),
      { 
        status: 404, 
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
      message: 'Package deleted successfully',
      id: packageId
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
