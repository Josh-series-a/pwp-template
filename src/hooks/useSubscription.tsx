
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      // If no user, set to unsubscribed and not loading
      setSubscriptionInfo({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null
      });
      setIsLoading(false);
    }
  }, [user]);

  const checkSubscription = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        // Don't show error toast for failed subscription checks
        // Set to unsubscribed state instead
        setSubscriptionInfo({
          subscribed: false,
          subscription_tier: null,
          subscription_end: null
        });
        return;
      }

      setSubscriptionInfo(data || {
        subscribed: false,
        subscription_tier: null,
        subscription_end: null
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Set to unsubscribed state on error
      setSubscriptionInfo({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckoutSession = async (plan: 'starter' | 'growth' | 'impact') => {
    if (!user) {
      toast.error('You must be logged in to subscribe');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Failed to create checkout session');
        return;
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session');
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      toast.error('You must be logged in to manage subscription');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) {
        console.error('Error opening customer portal:', error);
        toast.error('Failed to open customer portal');
        return;
      }

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open customer portal');
    }
  };

  return {
    subscriptionInfo,
    isLoading,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal
  };
};
