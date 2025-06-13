
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { creditService, type UserCredits, type HealthScoreCredits, CREDIT_COSTS } from '@/utils/creditService';
import { toast } from 'sonner';

export const useCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [healthScoreCredits, setHealthScoreCredits] = useState<HealthScoreCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCredits();
    }
  }, [user]);

  const fetchCredits = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const [userCredits, healthCredits] = await Promise.all([
      creditService.getUserCredits(user.id),
      creditService.getHealthScoreCredits(user.id)
    ]);
    
    setCredits(userCredits);
    setHealthScoreCredits(healthCredits);
    setIsLoading(false);
  };

  const checkCredits = (requiredCredits: number): boolean => {
    if (!credits) return false;
    return credits.credits >= requiredCredits;
  };

  const checkHealthScoreCredits = (requiredCredits: number): boolean => {
    if (!healthScoreCredits) return false;
    return healthScoreCredits.health_score_credits >= requiredCredits;
  };

  const deductCredits = async (
    amount: number, 
    description: string, 
    featureType: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to use this feature');
      return false;
    }

    if (!checkCredits(amount)) {
      toast.error(`Insufficient credits. You need ${amount} credits but only have ${credits?.credits || 0}.`);
      return false;
    }

    const result = await creditService.deductCredits(user.id, amount, description, featureType);
    
    if (result.success) {
      setCredits(prev => prev ? { ...prev, credits: result.newBalance || 0 } : null);
      toast.success(`${amount} credits deducted successfully`);
      return true;
    } else {
      toast.error(result.error || 'Failed to deduct credits');
      return false;
    }
  };

  const deductHealthScoreCredits = async (
    amount: number, 
    description: string, 
    featureType: string
  ): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to use this feature');
      return false;
    }

    if (!checkHealthScoreCredits(amount)) {
      toast.error(`Insufficient health score credits. You need ${amount} health score credits but only have ${healthScoreCredits?.health_score_credits || 0}.`);
      return false;
    }

    const result = await creditService.deductHealthScoreCredits(user.id, amount, description, featureType);
    
    if (result.success) {
      setHealthScoreCredits(prev => prev ? { ...prev, health_score_credits: result.newBalance || 0 } : null);
      toast.success(`${amount} health score credits deducted successfully`);
      return true;
    } else {
      toast.error(result.error || 'Failed to deduct health score credits');
      return false;
    }
  };

  const getCreditCost = (featureType: keyof typeof CREDIT_COSTS | keyof typeof CREDIT_COSTS.PACKAGES): number => {
    if (featureType === 'BUSINESS_HEALTH_SCORE') {
      return CREDIT_COSTS.BUSINESS_HEALTH_SCORE;
    }
    
    if (featureType in CREDIT_COSTS.PACKAGES) {
      return CREDIT_COSTS.PACKAGES[featureType as keyof typeof CREDIT_COSTS.PACKAGES];
    }
    
    return 0;
  };

  return {
    credits,
    healthScoreCredits,
    isLoading,
    checkCredits,
    checkHealthScoreCredits,
    deductCredits,
    deductHealthScoreCredits,
    getCreditCost,
    refreshCredits: fetchCredits,
    CREDIT_COSTS
  };
};
