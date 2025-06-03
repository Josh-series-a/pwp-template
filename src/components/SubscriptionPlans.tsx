
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
      id: 'basic',
      name: 'Basic',
      price: '$9.99',
      period: '/month',
      credits: 100,
      description: 'Perfect for small businesses',
      features: [
        '100 credits per month',
        'Business Health Score access',
        'Basic package creation',
        'Email support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19.99',
      period: '/month',
      credits: 250,
      description: 'Best for growing businesses',
      features: [
        '250 credits per month',
        'All Basic features',
        'Priority support',
        'Advanced analytics',
        'Custom integrations'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$49.99',
      period: '/month',
      credits: 1000,
      description: 'For large organizations',
      features: [
        '1000 credits per month',
        'All Premium features',
        'Dedicated support',
        'Custom reporting',
        'API access',
        'Priority processing'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground mt-2">
          Select the plan that best fits your business needs
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
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
                
                <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-muted/30 rounded-lg">
                  <Coins className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold">{plan.credits} credits/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
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
                      createCheckoutSession(plan.id as 'basic' | 'premium' | 'enterprise');
                    }
                  }}
                >
                  {isCurrentPlan ? "Manage Subscription" : `Subscribe to ${plan.name}`}
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
