
import { supabase } from '@/integrations/supabase/client';

export interface ExerciseAnswer {
  id?: string;
  user_id?: string;
  exercise_id: number;
  exercise_title: string;
  company_name?: string;
  answers: Record<string, any>;
  progress?: number;
  status?: 'new' | 'in-progress' | 'completed';
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

class ExerciseService {
  async saveExerciseAnswer(exerciseAnswer: Omit<ExerciseAnswer, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ExerciseAnswer | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('exercise_answers')
        .upsert({
          user_id: user.id,
          exercise_id: exerciseAnswer.exercise_id,
          exercise_title: exerciseAnswer.exercise_title,
          company_name: exerciseAnswer.company_name,
          answers: exerciseAnswer.answers,
          progress: exerciseAnswer.progress || 0,
          status: exerciseAnswer.status || 'new',
          completed_at: exerciseAnswer.status === 'completed' ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,exercise_id,company_name'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving exercise answer:', error);
        throw error;
      }

      return {
        ...data,
        answers: data.answers as Record<string, any>,
        status: data.status as 'new' | 'in-progress' | 'completed'
      };
    } catch (error) {
      console.error('Error in saveExerciseAnswer:', error);
      return null;
    }
  }

  async getExerciseAnswer(exerciseId: number, companyName?: string): Promise<ExerciseAnswer | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('exercise_answers')
        .select('*')
        .eq('user_id', user.id)
        .eq('exercise_id', exerciseId);

      if (companyName) {
        query = query.eq('company_name', companyName);
      } else {
        query = query.is('company_name', null);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('Error fetching exercise answer:', error);
        throw error;
      }

      if (!data) {
        return null;
      }

      return {
        ...data,
        answers: data.answers as Record<string, any>,
        status: data.status as 'new' | 'in-progress' | 'completed'
      };
    } catch (error) {
      console.error('Error in getExerciseAnswer:', error);
      return null;
    }
  }

  async getUserExerciseAnswers(companyName?: string): Promise<ExerciseAnswer[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('exercise_answers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (companyName) {
        query = query.eq('company_name', companyName);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching user exercise answers:', error);
        throw error;
      }

      return (data || []).map(item => ({
        ...item,
        answers: item.answers as Record<string, any>,
        status: item.status as 'new' | 'in-progress' | 'completed'
      }));
    } catch (error) {
      console.error('Error in getUserExerciseAnswers:', error);
      return [];
    }
  }
}

export const exerciseService = new ExerciseService();
