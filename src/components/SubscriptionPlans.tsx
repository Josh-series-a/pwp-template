
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Coins, Star, Zap, Rocket, RefreshCw } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SubscriptionPlans = () => {
  const { subscriptionInfo, createCheckoutSession, openCustomerPortal } = useSubscription();
  const { user } = useAuth();
  const { refreshCredits } = useCredits();
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasAutoSynced, setHasAutoSynced] = useState(false);

  // Auto-sync on page load
  useEffect(() => {
    if (user && !hasAutoSynced) {
      autoSyncSubscription();
      setHasAutoSynced(true);
    }
  }, [user, hasAutoSynced]);

  const autoSyncSubscription = async () => {
    if (!user) return;

    try {
      console.log('Auto-syncing subscription on page load...');
      const { data, error } = await supabase.functions.invoke('sync-subscription');

      if (error) {
        console.error('Auto-sync error:', error);
        return;
      }

      if (data?.success) {
        if (data.creditsAdded > 0) {
          toast.success(`${data.creditsAdded} subscription credits automatically added!`);
        }
        await refreshCredits();
      }
    } catch (error) {
      console.error('Auto-sync failed:', error);
    }
  };

  const syncSubscription = async () => {
    if (!user) {
      toast.error('You must be logged in to sync subscription');
      return;
    }

    setIsSyncing(true);
    try {
      console.log('Manual sync subscription...');
      const { data, error } = await supabase.functions.invoke('sync-subscription');

      console.log('Sync response:', { data, error });

      if (error) {
        console.error('Error syncing subscription:', error);
        toast.error('Failed to sync subscription');
        return;
      }

      if (data?.success) {
        toast.success(data.message || 'Subscription synced successfully');
        
        // Refresh credits display
        console.log('Refreshing credits...');
        await refreshCredits();
        
        // Small delay to ensure state updates
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data?.error || 'Failed to sync subscription');
      }
    } catch (error) {
      console.error('Error syncing subscription:', error);
      toast.error('Failed to sync subscription');
    } finally {
      setIsSyncing(false);
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      subtitle: 'Plant the Seed',
      price: '$9.99',
      period: '/month',
      credits: 18,
      description: 'For early-stage founders laying strong roots for a sustainable business.',
      features: [
        '18 credits per month',
        'Access to selected exercises (approximately 1 pack every 2 months)',
        'Digital access to Prosper With Purpose',
        '1 Discovery Meeting (15 minutes, after 3 months)',
        'Business Health Score Tool',
        'Email support'
      ],
      icon: Star,
      gradient: 'from-slate-600 to-slate-700',
      bgAccent: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textAccent: 'text-slate-600'
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      subtitle: 'Shape the Strategy',
      price: '$19.99',
      period: '/month',
      credits: 25,
      description: 'For purpose-driven businesses building momentum and clarity.',
      features: [
        '25 credits per month',
        'Full access to exercises and workbooks (approximately 1 pack per month)',
        'Digital access to Prosper With Purpose',
        'Free physical copy of Prosper With Purpose',
        '2 Discovery Meetings (30 minutes each)',
        'Access to 3 Strategy Tools (e.g. 1+1 Proposition, Delegation Scorecard)',
        'Monthly expert group session',
        'Priority email support'
      ],
      popular: true,
      icon: Zap,
      gradient: 'from-primary to-primary/80',
      bgAccent: 'bg-primary/5',
      borderColor: 'border-primary/20',
      textAccent: 'text-primary'
    },
    {
      id: 'impact',
      name: 'Impact Plan',
      subtitle: 'Lead with Purpose',
      price: '$49.99',
      period: '/month',
      credits: 55,
      description: 'For founders and teams ready to transform their business and legacy.',
      features: [
        '55 credits per month',
        'Full access to all 5 packs immediately',
        'Digital and signed physical copy of Prosper With Purpose',
        '4 Discovery Meetings (45 minutes each)',
        'Full access to all Strategy Tools and Templates',
        'Custom Progress Tracker',
        'Personalised onboarding session',
        'Access to 1:1 coaching upgrades',
        'Priority processing and support'
      ],
      icon: Rocket,
      gradient: 'from-secondary to-secondary/80',
      bgAccent: 'bg-secondary/10',
      borderColor: 'border-secondary/30',
      textAccent: 'text-secondary'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground">
          Choose Your Plan
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the plan that best fits your business journey and unlock your potential
        </p>
        
        {user && (
          <div className="flex justify-center">
            <Button
              onClick={syncSubscription}
              disabled={isSyncing}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isSyncing ? 'Syncing...' : 'Manual Sync (if needed)'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => {
          const isCurrentPlan = subscriptionInfo.subscription_tier?.toLowerCase() === plan.id;
          const IconComponent = plan.icon;
          
          return (
            <Card
              key={plan.id}
              className={`relative group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                isCurrentPlan
                  ? 'ring-2 ring-primary shadow-lg'
                  : plan.popular
                  ? 'ring-2 ring-primary/30 shadow-lg'
                  : 'hover:ring-2 hover:ring-primary/20 hover:shadow-md'
              } ${plan.borderColor} overflow-hidden`}
            >
              {/* Subtle background decoration */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${plan.gradient} opacity-5 rounded-full -translate-y-12 translate-x-12`} />
              
              {plan.popular && !isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold shadow-sm">
                    Most Popular
                  </Badge>
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-green-600 text-white px-4 py-1 text-sm font-semibold shadow-sm">
                    Current Plan
                  </Badge>
                </div>
              )}
              
              <CardHeader className={`text-center pb-6 ${plan.bgAccent} relative z-10 ${plan.popular || isCurrentPlan ? 'pt-8' : 'pt-6'}`}>
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${plan.gradient} text-white shadow-sm`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <p className={`text-lg font-semibold ${plan.textAccent}`}>
                  "{plan.subtitle}"
                </p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-lg text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base px-2">{plan.description}</CardDescription>
                </div>
                
                <div className={`flex items-center justify-center gap-2 mt-6 p-3 ${plan.bgAccent} rounded-lg border ${plan.borderColor}`}>
                  <Coins className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-lg text-gray-900">{plan.credits} credits/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start group">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-green-600 transition-transform group-hover:scale-110" />
                      </div>
                      <span className="ml-3 text-sm text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                    isCurrentPlan 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                      : `bg-gradient-to-r ${plan.gradient} hover:shadow-md hover:scale-[1.02] text-white`
                  }`}
                  onClick={() => {
                    if (isCurrentPlan) {
                      openCustomerPortal();
                    } else {
                      createCheckoutSession(plan.id as 'starter' | 'growth' | 'impact');
                    }
                  }}
                >
                  {isCurrentPlan ? "Manage Subscription" : `Subscribe to ${plan.subtitle}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {subscriptionInfo.subscribed && subscriptionInfo.subscription_end && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium text-green-800">
              Your subscription renews on{' '}
              <span className="font-bold">
                {new Date(subscriptionInfo.subscription_end).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
