import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, FileText, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dashboardPackageService, RecentPackage } from '@/utils/dashboardPackageService';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const RecentPackagesCarousel: React.FC = () => {
  const [packages, setPackages] = useState<RecentPackage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentPackages();

    // Set up real-time subscription for new packages
    const channel = supabase
      .channel('dashboard-recent-packages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'packages'
        },
        (payload) => {
          console.log('New package created:', payload);
          fetchRecentPackages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRecentPackages = async () => {
    setIsLoading(true);
    try {
      const recentPackages = await dashboardPackageService.getRecentPackages(6);
      setPackages(recentPackages);
    } catch (error) {
      console.error('Error fetching recent packages:', error);
      toast({ title: 'Failed to load recent packages', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, packages.length));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + packages.length) % Math.max(1, packages.length));
  };

  const handlePackageClick = (packageData: RecentPackage) => {
    navigate(`/dashboard/reports/pulse/${packageData.report_id}/${packageData.id}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Generated Packages
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

  if (packages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Generated Packages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Packages Yet</h3>
            <p className="text-muted-foreground">
              Generated packages will appear here once you create them.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const visiblePackages = packages.slice(currentIndex, currentIndex + 3);
  const shouldShowControls = packages.length > 3;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Generated Packages ({packages.length})
          </CardTitle>
          {shouldShowControls && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                disabled={packages.length <= 3}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                disabled={packages.length <= 3}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visiblePackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handlePackageClick(pkg)}
              className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg aspect-square"
            >
              {/* Background Image */}
              <div 
                className="h-full flex flex-col justify-between p-4 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${pkg.cover_image_url})` }}
              >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40 rounded-xl" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex justify-end">
                    <Badge variant="outline" className="bg-white/90 text-gray-900 border-white/50 text-xs">
                      {new Date(pkg.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-white drop-shadow-lg font-bold leading-tight line-clamp-2">
                      {pkg.package_name}
                    </h3>
                    <p className="text-white/90 drop-shadow text-sm">
                      {pkg.company_name}
                    </p>
                    <p className="text-white/80 drop-shadow text-xs">
                      {pkg.documents?.length || 0} Document{(pkg.documents?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentPackagesCarousel;