
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Coins } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

const SubscriptionPlans = () => {
  const { subscriptionInfo, createCheckoutSession, openCustomerPortal } = useSubscription();

  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      subtitle: 'Plant the Seed',
      price: '$9.99',
      period: '/month',
      credits: 5,
      description: 'For early-stage founders laying strong roots for a sustainable business.',
      features: [
        '5 credits per month',
        'Access to selected exercises (approximately 1 pack every 2 months)',
        'Digital access to Prosper With Purpose',
        '1 Discovery Meeting (15 minutes, after 3 months)',
        'Business Health Score Tool',
        'Email support'
      ]
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      subtitle: 'Shape the Strategy',
      price: '$19.99',
      period: '/month',
      credits: 10,
      description: 'For purpose-driven businesses building momentum and clarity.',
      features: [
        '10 credits per month',
        'Full access to exercises and workbooks (approximately 1 pack per month)',
        'Digital access to Prosper With Purpose',
        'Free physical copy of Prosper With Purpose',
        '2 Discovery Meetings (30 minutes each)',
        'Access to 3 Strategy Tools (e.g. 1+1 Proposition, Delegation Scorecard)',
        'Monthly expert group session',
        'Priority email support'
      ],
      popular: true
    },
    {
      id: 'impact',
      name: 'Impact Plan',
      subtitle: 'Lead with Purpose',
      price: '$49.99',
      period: '/month',
      credits: 35,
      description: 'For founders and teams ready to transform their business and legacy.',
      features: [
        '35 credits per month',
        'Full access to all 5 packs immediately',
        'Digital and signed physical copy of Prosper With Purpose',
        '4 Discovery Meetings (45 minutes each)',
        'Full access to all Strategy Tools and Templates',
        'Custom Progress Tracker',
        'Personalised onboarding session',
        'Access to 1:1 coaching upgrades',
        'Priority processing and support'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground mt-2">
          Select the plan that best fits your business journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = subscriptionInfo.subscription_tier?.toLowerCase() === plan.id;
          
          return (
            <Card
              key={plan.id}
              className={`relative ${
                isCurrentPlan
                  ? 'border-primary bg-primary/5'
                  : plan.popular
                  ? 'border-primary'
                  : 'border-border'
              }`}
            >
              {plan.popular && !isCurrentPlan && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              {isCurrentPlan && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500">
                  Current Plan
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm font-medium text-primary">"{plan.subtitle}"</p>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                
                <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-muted/30 rounded-lg">
                  <Coins className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold">{plan.credits} credits/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={isCurrentPlan ? "outline" : "default"}
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
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Your subscription renews on{' '}
            {new Date(subscriptionInfo.subscription_end).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
