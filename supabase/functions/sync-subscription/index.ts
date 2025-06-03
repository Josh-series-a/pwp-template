
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_KEY");
    if (!stripeKey) throw new Error("STRIPE_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    // Create Supabase client with service role key for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Also create client with anon key for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

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
    logStep("Found Stripe customer", { customerId });

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 10
    });

    logStep("Found active subscriptions", { count: subscriptions.data.length });

    let creditsAdded = 0;

    for (const subscription of subscriptions.data) {
      logStep("Processing subscription", { subscriptionId: subscription.id });

      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;

      let planCredits = 0;
      if (amount <= 999) {
        planCredits = 18; // Starter plan
      } else if (amount <= 1999) {
        planCredits = 25; // Growth plan  
      } else {
        planCredits = 55; // Impact plan
      }

      logStep("Subscription credits determined", { amount, planCredits });

      // Check if we already processed this subscription for this billing period
      const billingPeriodStart = new Date(subscription.current_period_start * 1000).toISOString();
      const { data: existingTransaction } = await supabaseService
        .from('credit_transactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('description', `Monthly subscription credits - ${subscription.id}`)
        .gte('created_at', billingPeriodStart)
        .maybeSingle();

      if (!existingTransaction && planCredits > 0) {
        // Get current credits
        const { data: currentCredits } = await supabaseService
          .from('user_credits')
          .select('credits')
          .eq('user_id', user.id)
          .maybeSingle();

        const currentAmount = currentCredits?.credits || 0;
        const newAmount = currentAmount + planCredits;

        logStep("Current credits", { currentAmount, adding: planCredits, newTotal: newAmount });

        // Update credits using upsert to handle both insert and update
        const { data: upsertResult, error: upsertError } = await supabaseService
          .from('user_credits')
          .upsert({
            user_id: user.id,
            credits: newAmount,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })
          .select();

        if (upsertError) {
          logStep("Error upserting credits", { error: upsertError });
          throw new Error(`Failed to update credits: ${upsertError.message}`);
        }

        logStep("Credits upserted successfully", { result: upsertResult });

        // Record transaction
        const { error: transactionError } = await supabaseService
          .from('credit_transactions')
          .insert({
            user_id: user.id,
            amount: planCredits,
            transaction_type: 'add',
            description: `Monthly subscription credits - ${subscription.id}`,
            feature_type: 'subscription_credits'
          });

        if (transactionError) {
          logStep("Error recording transaction", { error: transactionError });
          // Don't fail the whole operation for transaction logging issues
        }

        creditsAdded += planCredits;
        logStep("Subscription credits added", { planCredits, newTotal: newAmount });
      } else {
        logStep("Credits already processed for this billing period", { subscriptionId: subscription.id });
      }
    }

    logStep("Sync completed", { totalCreditsAdded: creditsAdded });

    // Verify final credits state
    const { data: finalCredits } = await supabaseService
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .maybeSingle();

    logStep("Final credits state", { credits: finalCredits?.credits || 0 });

    return new Response(JSON.stringify({ 
      success: true,
      creditsAdded,
      currentCredits: finalCredits?.credits || 0,
      message: creditsAdded > 0 ? `${creditsAdded} credits added to your account` : "Credits already up to date"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in sync-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
