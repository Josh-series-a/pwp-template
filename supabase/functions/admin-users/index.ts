
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the user is authenticated and is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header missing' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user is admin (either has Admin role or is the specific admin email)
    const isAdmin = user.user_metadata?.role === 'Admin' || user.email === 'colinfc@btinternet.com'
    
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'GET') {
      // Get all users
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

      if (error) {
        console.error('Error fetching users:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ users }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'POST') {
      const { action, email, password, name, role, userId } = await req.json()

      if (action === 'create') {
        console.log('Creating user:', { email, name, role })

        // Create the user with the specified role
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          user_metadata: {
            name,
            role: role || 'User'
          },
          email_confirm: true
        })

        if (error) {
          console.error('Error creating user:', error)
          
          // Handle specific error cases with appropriate status codes
          if (error.message?.includes('already been registered')) {
            return new Response(
              JSON.stringify({ error: 'A user with this email address already exists' }),
              { 
                status: 409, // Conflict
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }
          
          if (error.message?.includes('invalid email')) {
            return new Response(
              JSON.stringify({ error: 'Invalid email address format' }),
              { 
                status: 400, // Bad Request
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }
          
          if (error.message?.includes('password')) {
            return new Response(
              JSON.stringify({ error: 'Password does not meet requirements' }),
              { 
                status: 400, // Bad Request
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }

          // Generic error response
          return new Response(
            JSON.stringify({ error: error.message || 'Failed to create user' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        console.log('User created successfully:', data.user?.id)

        return new Response(
          JSON.stringify({ user: data.user }),
          { 
            status: 201, // Created
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      if (action === 'updateRole') {
        console.log('Updating user role:', { userId, role })

        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          {
            user_metadata: { role }
          }
        )

        if (error) {
          console.error('Error updating user role:', error)
          return new Response(
            JSON.stringify({ error: error.message }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        console.log('User role updated successfully:', data.user?.id)

        return new Response(
          JSON.stringify({ user: data.user }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
