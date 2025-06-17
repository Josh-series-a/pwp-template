import { supabase } from '@/integrations/supabase/client';

export interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface HealthScoreCredits {
  id: string;
  user_id: string;
  health_score_credits: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  description: string;
  feature_type: string;
  created_at: string;
}

// Credit costs for different features
export const CREDIT_COSTS = {
  // Health Score Credits (separate system)
  BUSINESS_HEALTH_SCORE: 1, // Uses 1 Health Score Credit
  
  // Regular Credits
  PACKAGES: {
    'PYBLC1': 8, // Plan Your Business Legacy with Confidence
    'USICD2': 6, // Understand and Serve Your Ideal Customers Deeply
    'DIIP3': 7,  // Differentiate Yourself with an Irresistible Proposition
    'ETYSDD4': 8, // Empower Your Team and Step Back from the Day-to-Day
    'SGKCR5': 6  // Strengthen and Grow Your Key Customer Relationships
  }
} as const;

export const creditService = {
  async getUserCredits(userId: string): Promise<UserCredits | null> {
    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user credits:', error);
      return null;
    }

    return data;
  },

  async getHealthScoreCredits(userId: string): Promise<HealthScoreCredits | null> {
    const { data, error } = await supabase
      .from('health_score_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching health score credits:', error);
      return null;
    }

    return data;
  },

  async createUserCredits(userId: string, initialCredits: number = 0): Promise<UserCredits | null> {
    const { data, error } = await supabase
      .from('user_credits')
      .insert({
        user_id: userId,
        credits: initialCredits
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user credits:', error);
      return null;
    }

    return data;
  },

  async createHealthScoreCredits(userId: string, initialCredits: number = 5): Promise<HealthScoreCredits | null> {
    const { data, error } = await supabase
      .from('health_score_credits')
      .insert({
        user_id: userId,
        health_score_credits: initialCredits
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating health score credits:', error);
      return null;
    }

    return data;
  },

  async deductCredits(
    userId: string, 
    amount: number, 
    description: string, 
    featureType: string
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    try {
      // First check current credits
      const currentCredits = await this.getUserCredits(userId);
      
      if (!currentCredits) {
        // Try to create credits record if it doesn't exist
        const newCredits = await this.createUserCredits(userId);
        if (!newCredits) {
          return { success: false, error: 'Failed to initialize credits' };
        }
      }

      const userCredits = currentCredits || await this.getUserCredits(userId);
      
      if (!userCredits || userCredits.credits < amount) {
        return { success: false, error: 'Insufficient credits' };
      }

      // Deduct credits
      const newBalance = userCredits.credits - amount;
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ credits: newBalance })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating credits:', updateError);
        return { success: false, error: 'Failed to update credits' };
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: -amount,
          transaction_type: 'deduct',
          description,
          feature_type: featureType
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        // Don't fail the operation if transaction recording fails
      }

      return { success: true, newBalance };
    } catch (error) {
      console.error('Error in deductCredits:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async deductHealthScoreCredits(
    userId: string, 
    amount: number, 
    description: string, 
    featureType: string
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    try {
      // First check current health score credits
      const currentCredits = await this.getHealthScoreCredits(userId);
      
      if (!currentCredits) {
        // Try to create health score credits record if it doesn't exist
        const newCredits = await this.createHealthScoreCredits(userId);
        if (!newCredits) {
          return { success: false, error: 'Failed to initialize health score credits' };
        }
      }

      const healthScoreCredits = currentCredits || await this.getHealthScoreCredits(userId);
      
      if (!healthScoreCredits || healthScoreCredits.health_score_credits < amount) {
        return { success: false, error: 'Insufficient health score credits' };
      }

      // Deduct health score credits
      const newBalance = healthScoreCredits.health_score_credits - amount;
      const { error: updateError } = await supabase
        .from('health_score_credits')
        .update({ health_score_credits: newBalance })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating health score credits:', updateError);
        return { success: false, error: 'Failed to update health score credits' };
      }

      // Record transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: -amount,
          transaction_type: 'deduct',
          description,
          feature_type: featureType
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        // Don't fail the operation if transaction recording fails
      }

      return { success: true, newBalance };
    } catch (error) {
      console.error('Error in deductHealthScoreCredits:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async getCreditTransactions(userId: string): Promise<CreditTransaction[]> {
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return data || [];
  }
};
