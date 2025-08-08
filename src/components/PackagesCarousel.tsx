import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, FileText, Trash2, Folder, FolderOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { packageService } from '@/utils/packageService';
import { packageQueueService, PackageQueueItem } from '@/utils/packageQueueService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import QueuedPackageCard from '@/components/QueuedPackageCard';
import sampleCover1 from '/lovable-uploads/package-covers/sample-cover-1.jpg';
import sampleCover2 from '/lovable-uploads/package-covers/sample-cover-2.jpg';
import sampleCover3 from '/lovable-uploads/package-covers/sample-cover-3.jpg';
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
  const [queuedPackages, setQueuedPackages] = useState<PackageQueueItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();

  // Sample covers for demo purposes
  const sampleCovers = [sampleCover1, sampleCover2, sampleCover3];

  useEffect(() => {
    fetchPackages();
    fetchQueuedPackages();

    // Set up real-time subscription for package queue updates
    const channel = supabase
      .channel('package-queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'package_queue',
          filter: `report_id=eq.${reportId}`
        },
        (payload) => {
          console.log('Package queue updated:', payload);
          fetchQueuedPackages(); // Refresh queue data
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'packages',
          filter: `report_id=eq.${reportId}`
        },
        (payload) => {
          console.log('Package created:', payload);
          fetchPackages(); // Refresh packages data
          fetchQueuedPackages(); // Refresh queue data (trigger should mark as completed)
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reportId]);

  const fetchQueuedPackages = async () => {
    try {
      const queueItems = await packageQueueService.getQueuedPackages(reportId);
      setQueuedPackages(queueItems);
    } catch (error) {
      console.error('Error fetching queued packages:', error);
      toast({ title: 'Failed to load queued packages', variant: 'destructive' });
    }
  };

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      // Fetch packages and enhance with cover images
      const userPackages = await packageService.getPackages(reportId);
      
      // First, let's see what's actually in the storage bucket
      const { data: allFiles, error: listError } = await supabase.storage
        .from('package-covers')
        .list('', {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      console.log('All files in package-covers bucket:', allFiles);
      
      if (listError) {
        console.error('Error listing files:', listError);
      }

      // Fetch cover images for each package
      const packagesWithCovers = await Promise.all(
        userPackages.map(async (pkg, index) => {
          try {
            let coverImageUrl = null;
            
            if (allFiles && allFiles.length > 0) {
              // Use uploaded images by cycling through them
              const fileIndex = index % allFiles.length;
              const selectedFile = allFiles[fileIndex];
              
              const { data } = supabase.storage
                .from('package-covers')
                .getPublicUrl(selectedFile.name);
              
              coverImageUrl = data.publicUrl;
              console.log(`Using uploaded cover for ${pkg.package_name}: ${selectedFile.name}`);
            }
            
            // Only use sample covers if no storage images found
            if (!coverImageUrl) {
              console.log(`Using sample cover for package ${pkg.package_name}`);
              coverImageUrl = sampleCovers[index % sampleCovers.length];
            }
            
            return { ...pkg, cover_image_url: coverImageUrl };
          } catch (error) {
            console.error('Error fetching cover image for package:', pkg.id, error);
            // Fallback to sample cover
            return { ...pkg, cover_image_url: sampleCovers[index % sampleCovers.length] };
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

  // Group packages by name
  const groupPackagesByName = () => {
    const groups: { [key: string]: Package[] } = {};
    packages.forEach(pkg => {
      if (!groups[pkg.package_name]) {
        groups[pkg.package_name] = [];
      }
      groups[pkg.package_name].push(pkg);
    });
    return groups;
  };

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFolderClick = (packageName: string, packagesInGroup: Package[]) => {
    // Navigate to a documents view page for this package folder
    const encodedPackageName = encodeURIComponent(packageName);
    const packageIds = packagesInGroup.map(pkg => pkg.id).join(',');
    const currentPath = window.location.pathname;
    navigate(`${currentPath}/documents/${encodedPackageName}?packages=${packageIds}`);
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
    <div className="space-y-6">
      {/* Queued Packages Section */}
      {queuedPackages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Queued Packages ({queuedPackages.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {queuedPackages.map((queuedPkg) => (
              <QueuedPackageCard 
                key={queuedPkg.id}
                packageName={queuedPkg.package_name}
                estimatedTime={packageQueueService.getRemainingTime(queuedPkg.estimated_completion_time)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Generated Packages Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Generated Packages ({packages.length})</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Object.entries(groupPackagesByName()).map(([packageName, packagesInGroup]) => {
            const isMultiple = packagesInGroup.length > 1;
            const isExpanded = expandedFolders.has(packageName);
            
            if (isMultiple) {
              // Render as folder if multiple packages with same name
              return (
                <div key={packageName} className="space-y-3">
                  {/* Folder Header with Cover Image */}
                  <div 
                    onClick={() => handleFolderClick(packageName, packagesInGroup)}
                    className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-lg aspect-square w-80 h-80"
                  >
                    {/* Background Image from first package in group */}
                    <div 
                      className={`h-full flex flex-col justify-between p-6 ${
                        packagesInGroup[0]?.cover_image_url 
                          ? 'bg-cover bg-center bg-no-repeat' 
                          : 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400'
                      }`}
                      style={packagesInGroup[0]?.cover_image_url ? { backgroundImage: `url(${packagesInGroup[0].cover_image_url})` } : {}}
                    >
                      {/* Dark overlay for better text readability */}
                      {packagesInGroup[0]?.cover_image_url && (
                        <div className="absolute inset-0 bg-black/10 rounded-xl" />
                      )}
                      
                      
                      {/* Package Name and Details */}
                      <div className="space-y-2 relative z-10 mt-4">
                        <h4 className={`text-xl font-bold leading-tight ${
                          packagesInGroup[0]?.cover_image_url ? 'text-white drop-shadow-lg' : 'text-blue-900'
                        }`}>
                          {packageName}
                        </h4>
                        <p className={`text-base font-medium ${
                          packagesInGroup[0]?.cover_image_url ? 'text-white/90 drop-shadow' : 'text-blue-800'
                        }`}>
                          {packagesInGroup.length} version{packagesInGroup.length !== 1 ? 's' : ''} • {packagesInGroup.reduce((total, pkg) => total + (pkg.documents?.length || 0), 0)} documents total
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={`text-xs ${
                            packagesInGroup[0]?.cover_image_url 
                              ? 'bg-white/90 text-gray-900 border-white/50' 
                              : 'bg-white/80'
                          }`}>
                            Latest: {new Date(packagesInGroup[0]?.created_at).toLocaleDateString()}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${
                            packagesInGroup[0]?.cover_image_url 
                              ? 'bg-white/90 text-gray-900 border-white/50' 
                              : 'bg-white/80'
                          }`}>
                            {isExpanded ? 'Click to collapse' : 'Click to expand'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Folder Contents - Show All Documents */}
                  {isExpanded && (
                    <div className="space-y-4 ml-8">
                      <div className="text-sm text-muted-foreground font-medium">
                        All Documents in "{packageName}" ({packagesInGroup.reduce((total, pkg) => total + (pkg.documents?.length || 0), 0)} documents)
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packagesInGroup.flatMap((pkg) => 
                          pkg.documents?.map((doc, docIndex) => {
                            const docUrl = doc.document[0];
                            const isGoogleDoc = docUrl && docUrl.includes('docs.google.com');
                            const thumbnailUrl = isGoogleDoc ? 
                              docUrl.replace('/edit', '/preview').replace('/edit?', '/preview?') : null;
                            
                            return (
                              <div key={`${pkg.id}-${docIndex}`}>
                                <div 
                                  onClick={() => handlePackageClick(pkg.id)}
                                  className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-white border"
                                  style={{ minHeight: '280px' }}
                                >
                                  {/* Document Preview/Thumbnail */}
                                  {thumbnailUrl ? (
                                    <div className="h-40 bg-muted overflow-hidden">
                                      <img 
                                        src={thumbnailUrl}
                                        alt={`${doc.name} preview`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                      <FileText className="h-12 w-12 text-gray-400" />
                                    </div>
                                  )}
                                  
                                  {/* Document Info */}
                                  <div className="p-4 space-y-3">
                                    <div>
                                      <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-gray-900">
                                        {doc.name}
                                      </h3>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        From version {packagesInGroup.indexOf(pkg) + 1}
                                      </p>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                      <div className="flex gap-2">
                                        <Badge variant="outline" className="text-xs">
                                          {new Date(pkg.created_at).toLocaleDateString()}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          5 Credits
                                        </Badge>
                                      </div>
                                      
                                      {/* Action Buttons */}
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const params = new URLSearchParams({
                                              url: encodeURIComponent(doc.document[0]),
                                              title: encodeURIComponent(doc.name)
                                            });
                                            const currentPath = window.location.pathname;
                                            navigate(`${currentPath}/${pkg.id}/preview?${params.toString()}`);
                                          }}
                                        >
                                          Preview
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="default"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(doc.document[0], '_blank');
                                          }}
                                        >
                                          Open
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Delete Package Button (top right) */}
                                  <div className="absolute top-2 right-2">
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="bg-white/80 hover:bg-white/90 text-destructive hover:text-destructive"
                                          onClick={(e) => e.stopPropagation()}
                                          aria-label="Delete package"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete this package version?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will delete version {packagesInGroup.indexOf(pkg) + 1} of "{packageName}" and its document "{doc.name}". This action cannot be undone.
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
                                            Delete Version
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              </div>
                            );
                          }) || []
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            } else {
              // Render single package normally
              const pkg = packagesInGroup[0];
              return (
                <div key={pkg.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
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
                </div>
              );
            }
          })}
        </div>
      </div>
      </div>
    );
  };

export default PackagesCarousel;
