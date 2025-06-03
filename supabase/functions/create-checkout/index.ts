
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_KEY");
    if (!stripeKey) throw new Error("STRIPE_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { plan, type = "subscription" } = await req.json();
    logStep("Request received", { plan, type });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("Creating new customer");
    }

    let sessionConfig;

    if (type === "credits") {
      // Handle credit purchases
      const creditPackages = {
        starter: { price: 999, credits: 18, name: "Starter Credit Pack - 18 Credits" },
        growth: { price: 1999, credits: 25, name: "Growth Credit Pack - 25 Credits" },
        impact: { price: 4999, credits: 55, name: "Impact Credit Pack - 55 Credits" }
      };

      const packageDetails = creditPackages[plan as keyof typeof creditPackages];
      if (!packageDetails) {
        throw new Error("Invalid credit package selected");
      }

      logStep("Creating credit purchase session", packageDetails);

      sessionConfig = {
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: packageDetails.name,
                description: `${packageDetails.credits} credits for business analysis tools`
              },
              unit_amount: packageDetails.price,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.get("origin")}/account?purchase_success=true&type=credits`,
        cancel_url: `${req.headers.get("origin")}/account?canceled=true`,
        metadata: {
          user_id: user.id,
          plan: plan,
          credits: packageDetails.credits.toString(),
          type: 'credit_purchase'
        }
      };
    } else {
      // Handle subscription purchases
      const pricingMap = {
        starter: { price: 999, credits: 18, name: "Starter Plan - Plant the Seed" },
        growth: { price: 1999, credits: 25, name: "Growth Plan - Shape the Strategy" },
        impact: { price: 4999, credits: 55, name: "Impact Plan - Lead with Purpose" }
      };

      const planDetails = pricingMap[plan as keyof typeof pricingMap];
      if (!planDetails) {
        throw new Error("Invalid plan selected");
      }

      logStep("Creating subscription session", planDetails);

      sessionConfig = {
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: planDetails.name,
                description: `${planDetails.credits} credits monthly`
              },
              unit_amount: planDetails.price,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.get("origin")}/account?success=true`,
        cancel_url: `${req.headers.get("origin")}/account?canceled=true`,
        metadata: {
          user_id: user.id,
          plan: plan,
          credits: planDetails.credits.toString()
        }
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
