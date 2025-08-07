import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText } from 'lucide-react';
import { dashboardPackageService } from '@/utils/dashboardPackageService';
import { packageQueueService, PackageQueueItem } from '@/utils/packageQueueService';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PackageQueueSection: React.FC = () => {
  const [queuedPackages, setQueuedPackages] = useState<PackageQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQueuedPackages();

    // Set up real-time subscription for package queue updates
    const channel = supabase
      .channel('dashboard-package-queue')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'package_queue'
        },
        (payload) => {
          console.log('Package queue updated:', payload);
          fetchQueuedPackages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchQueuedPackages = async () => {
    setIsLoading(true);
    try {
      const packages = await dashboardPackageService.getUserQueuedPackages();
      setQueuedPackages(packages);
    } catch (error) {
      console.error('Error fetching queued packages:', error);
      toast({ title: 'Failed to load package queue', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Package Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (queuedPackages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Package Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Packages in Queue</h3>
            <p className="text-muted-foreground">
              Your package generation queue is empty.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Package Queue ({queuedPackages.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {queuedPackages.map((pkg) => {
            const remainingTime = packageQueueService.getRemainingTime(pkg.estimated_completion_time);
            return (
              <div key={pkg.id} className="relative overflow-hidden rounded-lg border p-4">
                {/* Shimmer Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/80 to-muted animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer -skew-x-12" />
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {pkg.status === 'queued' ? 'In Queue' : 'Processing'}
                      </Badge>
                    </div>
                    <h4 className="font-semibold">{pkg.package_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {(pkg as any).reports?.company_name || 'Unknown Company'}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {formatTime(remainingTime)} remaining
                      </span>
                    </div>
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                        style={{ 
                          width: `${Math.max(5, ((600 - remainingTime) / 600) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageQueueSection;