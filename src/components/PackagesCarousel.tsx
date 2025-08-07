import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, FileText, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { packageService } from '@/utils/packageService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
interface PackageDocument {
  name: string;
  document: string[];
}

interface Package {
  id: string;
  user_id: string;
  report_id: string;
  package_name: string;
  documents: PackageDocument[];
  created_at: string;
  updated_at: string;
  cover_image_url?: string;
}

interface PackagesCarouselProps {
  reportId: string;
}

const PackagesCarousel: React.FC<PackagesCarouselProps> = ({ reportId }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      // Fetch packages and enhance with cover images
      const userPackages = await packageService.getPackages(reportId);
      
      // Fetch cover images for each package
      const packagesWithCovers = await Promise.all(
        userPackages.map(async (pkg) => {
          try {
            // Try to get cover image from storage
            const { data: files } = await supabase.storage
              .from('package-covers')
              .list(`${pkg.user_id}`, {
                search: `${pkg.id}`,
              });

            if (files && files.length > 0) {
              const { data } = supabase.storage
                .from('package-covers')
                .getPublicUrl(`${pkg.user_id}/${files[0].name}`);
              
              return { ...pkg, cover_image_url: data.publicUrl };
            }
            
            return pkg;
          } catch (error) {
            console.error('Error fetching cover image for package:', pkg.id, error);
            return pkg;
          }
        })
      );
      
      setPackages(packagesWithCovers || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({ title: 'Failed to load packages', variant: 'destructive' });
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  };
  const confirmDeletePackage = async (packageId: string) => {
    try {
      await packageService.deletePackage(packageId);
      setPackages((prev) => prev.filter((p) => p.id !== packageId));
      toast({ title: 'Package deleted' });
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({ title: 'Failed to delete package', variant: 'destructive' });
    }
  };

  const handlePackageClick = (packageId: string) => {
    // Navigate to package detail page
    const currentPath = window.location.pathname;
    const packageDetailPath = `${currentPath}/${packageId}`;
    navigate(packageDetailPath);
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Packages Yet</h3>
          <p className="text-muted-foreground">
            Packages will appear here once they are created for this report.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Generated Packages ({packages.length})</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id}>
            {/* Square Package Card - Clickable */}
            <div 
              onClick={() => handlePackageClick(pkg.id)}
              className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg aspect-square"
            >
              {/* Background Image or Gradient Fallback */}
              <div 
                className={`h-full flex flex-col justify-between p-6 ${
                  pkg.cover_image_url 
                    ? 'bg-cover bg-center bg-no-repeat' 
                    : 'bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400'
                }`}
                style={pkg.cover_image_url ? { backgroundImage: `url(${pkg.cover_image_url})` } : {}}
              >
                {/* Dark overlay for better text readability when using images */}
                {pkg.cover_image_url && (
                  <div className="absolute inset-0 bg-black/40 rounded-xl" />
                )}
                <div className="flex justify-end gap-2 relative z-10">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`text-destructive hover:bg-destructive/10 ${
                          pkg.cover_image_url ? 'bg-white/20 hover:bg-white/30' : ''
                        }`}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Delete package"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this package?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The package and its references will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeletePackage(pkg.id);
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                </div>
                <div className="space-y-3 relative z-10">
                  <h2 className={`text-xl font-bold leading-tight line-clamp-3 ${
                    pkg.cover_image_url ? 'text-white drop-shadow-lg' : 'text-gray-900'
                  }`}>
                    {pkg.package_name}
                  </h2>
                  <p className={`text-base font-medium ${
                    pkg.cover_image_url ? 'text-white/90 drop-shadow' : 'text-gray-800'
                  }`}>
                    {pkg.documents?.length || 0} Document{(pkg.documents?.length || 0) !== 1 ? 's' : ''}
                  </p>
                  <Badge variant="outline" className={`text-xs w-fit ${
                    pkg.cover_image_url 
                      ? 'bg-white/90 text-gray-900 border-white/50' 
                      : 'bg-white/80'
                  }`}>
                    {new Date(pkg.created_at).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagesCarousel;
