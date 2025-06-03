
import React, { useState } from 'react';
import { Check, CreditCard, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { toast } from 'sonner';

const SubscriptionPlans = () => {
  const { isAuthenticated } = useAuth();
  const { refreshCredits } = useCredits();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const subscriptionPlans = [
    {
      name: "Starter",
      id: "starter",
      price: "$9.99",
      period: "/month",
      description: "Perfect for entrepreneurs just starting their journey",
      credits: "18 credits monthly",
      features: [
        "Business Health Score Analysis",
        "2-3 focused exercise packages",
        "Basic insights and recommendations",
        "Email support"
      ],
      popular: false,
      buttonText: "Start Free Trial"
    },
    {
      name: "Growth",
      id: "growth", 
      price: "$19.99",
      period: "/month",
      description: "Ideal for growing businesses ready to scale",
      credits: "25 credits monthly",
      features: [
        "Everything in Starter",
        "3-4 comprehensive exercise packages",
        "Advanced business insights",
        "Priority email support",
        "Monthly strategy session"
      ],
      popular: true,
      buttonText: "Start Free Trial"
    },
    {
      name: "Impact",
      id: "impact",
      price: "$49.99", 
      period: "/month",
      description: "For established businesses focused on sustainable growth",
      credits: "55 credits monthly",
      features: [
        "Everything in Growth",
        "All exercise packages available",
        "Comprehensive business analysis",
        "Phone & email support",
        "Weekly strategy sessions",
        "Custom report generation"
      ],
      popular: false,
      buttonText: "Start Free Trial"
    }
  ];

  const creditPackages = [
    {
      name: "Starter Pack",
      id: "starter",
      price: "$9.99",
      credits: 18,
      description: "Perfect for trying out our analysis tools",
      features: [
        "18 analysis credits",
        "1-2 business health reports",
        "Basic exercise packages",
        "Valid for 6 months"
      ],
      popular: false
    },
    {
      name: "Growth Pack", 
      id: "growth",
      price: "$19.99",
      credits: 25,
      description: "Great value for regular business analysis",
      features: [
        "25 analysis credits",
        "3-4 comprehensive reports",
        "Multiple exercise packages",
        "Valid for 6 months"
      ],
      popular: true
    },
    {
      name: "Impact Pack",
      id: "impact", 
      price: "$49.99",
      credits: 55,
      description: "Maximum value for extensive business insights",
      features: [
        "55 analysis credits",
        "8-10 detailed reports",
        "All exercise packages",
        "Valid for 12 months"
      ],
      popular: false
    }
  ];

  const handleSubscription = async (planId: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to subscribe');
      return;
    }

    setIsLoading(planId);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: planId, type: 'subscription' }
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Failed to create checkout session');
    } finally {
      setIsLoading(null);
    }
  };

  const handleCreditPurchase = async (packageId: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to purchase credits');
      return;
    }

    setIsLoading(packageId);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: packageId, type: 'credits' }
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Credit purchase error:', error);
      toast.error(error.message || 'Failed to create checkout session');
    } finally {
      setIsLoading(null);
    }
  };

  const handleSyncPurchases = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to sync purchases');
      return;
    }

    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-purchases');

      if (error) throw error;
      
      toast.success(data?.message || 'Purchases synced successfully!');
      await refreshCredits(); // Refresh credits display
    } catch (error: any) {
      console.error('Sync error:', error);
      toast.error(error.message || 'Failed to sync purchases');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Choose Your Plan
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-6">
          Whether you prefer monthly subscriptions or one-time credit purchases, we have options to fit your business needs.
        </p>
        
        {isAuthenticated && (
          <Button
            onClick={handleSyncPurchases}
            disabled={isSyncing}
            variant="outline"
            className="mb-8 border-white/30 text-white hover:bg-white/10"
          >
            {isSyncing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Sync Recent Purchases
          </Button>
        )}
      </div>

      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 border-white/20">
          <TabsTrigger value="subscription" className="data-[state=active]:bg-white/20 text-white">
            Monthly Subscriptions
          </TabsTrigger>
          <TabsTrigger value="credits" className="data-[state=active]:bg-white/20 text-white">
            One-Time Credits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscription">
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className={`relative bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-300 ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                  <div className="text-blue-400 font-medium">{plan.credits}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="bg-white/20" />
                  <Button 
                    onClick={() => handleSubscription(plan.id)}
                    disabled={isLoading === plan.id}
                    className={`w-full rounded-full transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-white/10 hover:bg-white/20 border border-white/30 text-white'
                    }`}
                  >
                    {isLoading === plan.id ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="credits">
          <div className="grid md:grid-cols-3 gap-6">
            {creditPackages.map((pack) => (
              <Card key={pack.id} className={`relative bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl ${pack.popular ? 'ring-2 ring-purple-500' : ''}`}>
                {pack.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 hover:bg-purple-700 text-white">
                    Best Value
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-white text-xl">{pack.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-white">{pack.price}</span>
                    <span className="text-gray-300 ml-1">one-time</span>
                  </div>
                  <CardDescription className="text-gray-300">{pack.description}</CardDescription>
                  <div className="text-purple-400 font-medium">{pack.credits} credits</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {pack.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="bg-white/20" />
                  <Button 
                    onClick={() => handleCreditPurchase(pack.id)}
                    disabled={isLoading === pack.id}
                    className={`w-full rounded-full transition-all duration-300 ${
                      pack.popular 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : 'bg-white/10 hover:bg-white/20 border border-white/30 text-white'
                    }`}
                  >
                    {isLoading === pack.id ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Buy Credits
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionPlans;
