
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Coins, Star, Zap, Rocket } from 'lucide-react';
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
      ],
      icon: Star,
      gradient: 'from-blue-500 to-cyan-500',
      bgAccent: 'bg-blue-50',
      borderColor: 'border-blue-200'
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
      popular: true,
      icon: Zap,
      gradient: 'from-purple-500 to-pink-500',
      bgAccent: 'bg-purple-50',
      borderColor: 'border-purple-200'
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
      ],
      icon: Rocket,
      gradient: 'from-orange-500 to-red-500',
      bgAccent: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Choose Your Plan
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the plan that best fits your business journey and unlock your potential
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => {
          const isCurrentPlan = subscriptionInfo.subscription_tier?.toLowerCase() === plan.id;
          const IconComponent = plan.icon;
          
          return (
            <Card
              key={plan.id}
              className={`relative group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                isCurrentPlan
                  ? 'ring-2 ring-primary shadow-xl scale-105'
                  : plan.popular
                  ? 'ring-2 ring-purple-500 shadow-xl scale-105'
                  : 'hover:ring-2 hover:ring-primary/50'
              } ${plan.borderColor} overflow-hidden`}
            >
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.gradient} opacity-10 rounded-full -translate-y-16 translate-x-16`} />
              
              {plan.popular && !isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className={`bg-gradient-to-r ${plan.gradient} text-white px-4 py-1 text-sm font-semibold shadow-lg`}>
                    ✨ Most Popular
                  </Badge>
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                    ✅ Current Plan
                  </Badge>
                </div>
              )}
              
              <CardHeader className={`text-center pb-6 ${plan.bgAccent} relative z-10`}>
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${plan.gradient} text-white shadow-lg`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <p className={`text-lg font-semibold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                  "{plan.subtitle}"
                </p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-lg text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base px-2">{plan.description}</CardDescription>
                </div>
                
                <div className={`flex items-center justify-center gap-2 mt-6 p-4 bg-gradient-to-r ${plan.gradient} bg-opacity-10 rounded-xl border ${plan.borderColor}`}>
                  <Coins className="h-6 w-6 text-yellow-600" />
                  <span className="font-bold text-lg text-gray-900">{plan.credits} credits/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start group">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-green-500 transition-transform group-hover:scale-110" />
                      </div>
                      <span className="ml-3 text-sm text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                    isCurrentPlan 
                      ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800' 
                      : `bg-gradient-to-r ${plan.gradient} hover:shadow-lg hover:scale-105 text-white`
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
          <div className="inline-flex items-center gap-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
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
