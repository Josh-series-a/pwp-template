
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-PURCHASES] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_KEY");
    if (!stripeKey) throw new Error("STRIPE_KEY is not set");

    // Create Supabase client with service role for database writes
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create regular Supabase client for user auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Find Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      return new Response(JSON.stringify({ message: "No Stripe customer found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Get completed checkout sessions for this customer
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 100,
    });

    logStep("Found sessions", { count: sessions.data.length });

    let creditsAdded = 0;
    let billingRecordsAdded = 0;

    for (const session of sessions.data) {
      if (session.payment_status !== 'paid') continue;

      logStep("Processing session", { 
        sessionId: session.id, 
        mode: session.mode, 
        amount: session.amount_total 
      });

      // Add billing history record
      const { error: billingError } = await supabaseService
        .from('billing_history')
        .upsert({
          user_id: user.id,
          plan_name: session.metadata?.plan || 'Unknown',
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          purchase_date: new Date(session.created * 1000).toISOString(),
          period_start: new Date(session.created * 1000).toISOString(),
          period_end: session.mode === 'subscription' 
            ? new Date((session.created + 30 * 24 * 60 * 60) * 1000).toISOString()
            : new Date(session.created * 1000).toISOString(),
          status: 'paid',
          stripe_invoice_id: session.id,
          invoice_url: session.url,
          receipt_url: session.url
        }, {
          onConflict: 'stripe_invoice_id',
          ignoreDuplicates: true
        });

      if (!billingError) {
        billingRecordsAdded++;
      }

      // Handle credit purchases (one-time payments)
      if (session.mode === 'payment' && session.metadata?.type === 'credit_purchase') {
        const creditsFromMetadata = parseInt(session.metadata.credits || '0');
        
        if (creditsFromMetadata > 0) {
          // Get current credits
          const { data: currentCredits } = await supabaseService
            .from('user_credits')
            .select('credits')
            .eq('user_id', user.id)
            .single();

          const currentAmount = currentCredits?.credits || 0;
          const newAmount = currentAmount + creditsFromMetadata;

          // Update credits
          const { error: creditError } = await supabaseService
            .from('user_credits')
            .upsert({
              user_id: user.id,
              credits: newAmount,
              updated_at: new Date().toISOString()
            });

          if (!creditError) {
            // Record transaction
            await supabaseService
              .from('credit_transactions')
              .insert({
                user_id: user.id,
                amount: creditsFromMetadata,
                transaction_type: 'add',
                description: `Credits purchased - Session ${session.id}`,
                feature_type: 'credit_purchase'
              });

            creditsAdded += creditsFromMetadata;
            logStep("Credits added", { credits: creditsFromMetadata, newTotal: newAmount });
          }
        }
      }
    }

    // Also sync subscription renewals from invoices
    const invoices = await stripe.invoices.list({
      customer: customerId,
      status: 'paid',
      limit: 50,
    });

    for (const invoice of invoices.data) {
      if (!invoice.subscription) continue;

      // Get subscription details to determine credits
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      const priceId = subscription.items.data[0]?.price.id;
      
      if (priceId) {
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;
        
        let monthlyCredits = 0;
        if (amount <= 1199) {
          monthlyCredits = 18; // Starter
        } else if (amount <= 2999) {
          monthlyCredits = 25; // Growth  
        } else {
          monthlyCredits = 55; // Impact
        }

        if (monthlyCredits > 0) {
          // Check if we already processed this invoice
          const { data: existingTransaction } = await supabaseService
            .from('credit_transactions')
            .select('id')
            .eq('user_id', user.id)
            .eq('description', `Monthly subscription credits - Invoice ${invoice.id}`)
            .single();

          if (!existingTransaction) {
            // Get current credits
            const { data: currentCredits } = await supabaseService
              .from('user_credits')
              .select('credits')
              .eq('user_id', user.id)
              .single();

            const currentAmount = currentCredits?.credits || 0;
            const newAmount = currentAmount + monthlyCredits;

            // Add monthly credits
            await supabaseService
              .from('user_credits')
              .upsert({
                user_id: user.id,
                credits: newAmount,
                updated_at: new Date().toISOString()
              });

            // Record transaction
            await supabaseService
              .from('credit_transactions')
              .insert({
                user_id: user.id,
                amount: monthlyCredits,
                transaction_type: 'add',
                description: `Monthly subscription credits - Invoice ${invoice.id}`,
                feature_type: 'subscription_renewal'
              });

            creditsAdded += monthlyCredits;
          }
        }
      }
    }

    logStep("Sync completed", { creditsAdded, billingRecordsAdded });

    return new Response(JSON.stringify({ 
      success: true, 
      creditsAdded, 
      billingRecordsAdded,
      message: `Sync completed: ${creditsAdded} credits added, ${billingRecordsAdded} billing records added` 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in sync-purchases", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
