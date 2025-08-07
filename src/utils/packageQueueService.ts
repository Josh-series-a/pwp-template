import { supabase } from '@/integrations/supabase/client';

export interface PackageQueueItem {
  id: string;
  user_id: string;
  report_id: string;
  package_name: string;
  documents: string[];
  status: 'queued' | 'processing' | 'completed' | 'failed';
  estimated_completion_time: string;
  requested_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export const packageQueueService = {
  // Get queued packages for a report
  async getQueuedPackages(reportId: string): Promise<PackageQueueItem[]> {
    const { data, error } = await supabase
      .from('package_queue')
      .select('*')
      .eq('report_id', reportId)
      .in('status', ['queued', 'processing'])
      .order('requested_at', { ascending: false });

    if (error) {
      console.error('Error fetching queued packages:', error);
      throw error;
    }

    return (data || []).map(item => ({
      ...item,
      status: item.status as 'queued' | 'processing' | 'completed' | 'failed'
    }));
  },

  // Add a package to the queue
  async addToQueue(
    reportId: string, 
    packageName: string, 
    documents: string[] = [],
    estimatedMinutes: number = 10
  ): Promise<PackageQueueItem> {
    const estimatedCompletionTime = new Date();
    estimatedCompletionTime.setMinutes(estimatedCompletionTime.getMinutes() + estimatedMinutes);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('package_queue')
      .insert({
        user_id: user.id,
        report_id: reportId,
        package_name: packageName,
        documents,
        status: 'queued',
        estimated_completion_time: estimatedCompletionTime.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding package to queue:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as 'queued' | 'processing' | 'completed' | 'failed'
    };
  },

  // Update queue item status
  async updateStatus(
    queueId: string, 
    status: 'queued' | 'processing' | 'completed' | 'failed'
  ): Promise<void> {
    const updateData: any = { status };
    
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('package_queue')
      .update(updateData)
      .eq('id', queueId);

    if (error) {
      console.error('Error updating queue status:', error);
      throw error;
    }
  },

  // Remove completed items from queue
  async removeCompleted(reportId: string): Promise<void> {
    const { error } = await supabase
      .from('package_queue')
      .delete()
      .eq('report_id', reportId)
      .eq('status', 'completed');

    if (error) {
      console.error('Error removing completed queue items:', error);
      throw error;
    }
  },

  // Calculate remaining time for a queue item
  getRemainingTime(estimatedCompletionTime: string): number {
    const now = new Date();
    const completionTime = new Date(estimatedCompletionTime);
    const remainingMs = completionTime.getTime() - now.getTime();
    return Math.max(0, Math.floor(remainingMs / 1000)); // Return seconds
  }
};