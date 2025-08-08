import { supabase } from '@/integrations/supabase/client';
import { PackageQueueItem } from './packageQueueService';

export interface RecentPackage {
  id: string;
  package_name: string;
  report_id: string;
  report_title: string;
  company_name: string;
  documents: any[];
  created_at: string;
  cover_image_url?: string;
}

export const dashboardPackageService = {
  // Get all queued packages for the current user
  async getUserQueuedPackages(): Promise<PackageQueueItem[]> {
    const { data, error } = await supabase
      .from('package_queue')
      .select('*')
      .in('status', ['queued', 'processing'])
      .order('requested_at', { ascending: false });

    if (error) {
      console.error('Error fetching user queued packages:', error);
      throw error;
    }

    return (data || []).map(item => ({
      ...item,
      status: item.status as 'queued' | 'processing' | 'completed' | 'failed'
    }));
  },

  // Get recent generated packages for the current user
  async getRecentPackages(limit: number = 6): Promise<RecentPackage[]> {
    const { data, error } = await supabase
      .from('packages')
      .select(`
        *,
        reports!inner(title, company_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent packages:', error);
      throw error;
    }

    // Enhance with cover images similar to PackagesCarousel
    const sampleCovers = [
      '/lovable-uploads/package-covers/sample-cover-1.jpg',
      '/lovable-uploads/package-covers/sample-cover-2.jpg',
      '/lovable-uploads/package-covers/sample-cover-3.jpg'
    ];

    return (data || []).map((pkg, index) => ({
      id: pkg.id,
      package_name: pkg.package_name,
      report_id: pkg.report_id,
      report_title: pkg.reports.title,
      company_name: pkg.reports.company_name,
      documents: Array.isArray(pkg.documents) ? pkg.documents : [],
      created_at: pkg.created_at,
      cover_image_url: sampleCovers[index % sampleCovers.length]
    }));
  }
};