
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncSubscriptionCredits = async (user: User) => {
    try {
      console.log('Auto-syncing subscription credits for user:', user.email);
      const { data, error } = await supabase.functions.invoke('sync-subscription');
      
      if (error) {
        console.error('Auto-sync error:', error);
        return;
      }

      if (data?.success && data?.creditsAdded > 0) {
        console.log(`Auto-sync: ${data.creditsAdded} credits added`);
      }
    } catch (error) {
      console.error('Auto-sync failed:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // Auto-sync credits when user logs in
      if (session?.user) {
        checkSubscriptionStatus();
        syncSubscriptionCredits(session.user);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // Auto-sync credits on auth state change
      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        checkSubscriptionStatus();
        syncSubscriptionCredits(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      await supabase.functions.invoke('check-subscription');
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextProps = { 
    user, 
    isLoading, 
    isAuthenticated: !!user,
    signOut 
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
