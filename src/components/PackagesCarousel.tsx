
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, FileText, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Document {
  name: string;
  document: string[];
}

interface Package {
  id: string;
  package_name: string;
  documents: Document[];
  created_at: string;
  user_id: string;
  report_id: string;
}

interface PackagesCarouselProps {
  reportId: string;
}

const PackagesCarousel: React.FC<PackagesCarouselProps> = ({ reportId }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchPackages();
  }, [reportId, user]);

  const fetchPackages = async () => {
    if (!reportId) return;
    
    setIsLoading(true);
    try {
      // Fetch packages using the edge function
      const response = await fetch(
        `https://eiksxjzbwzujepqgmxsp.supabase.co/functions/v1/packages?reportId=${reportId}${user ? `&userId=${user.id}` : ''}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa3N4anpid3p1amVwcWdteHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTk4NTMsImV4cCI6MjA1ODM5NTg1M30.8DC-2c-QaqQlGbwrw2bNutDfTJYFFEPtPbzhWobZOLY`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();
      
      if (result.success) {
        setPackages(result.packages);
      } else {
        console.error('Error fetching packages:', result.error);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePackageExpansion = (packageId: string) => {
    const newExpanded = new Set(expandedPackages);
    if (newExpanded.has(packageId)) {
      newExpanded.delete(packageId);
    } else {
      newExpanded.add(packageId);
    }
    setExpandedPackages(newExpanded);
  };

  const openDocument = (url: string) => {
    window.open(url, '_blank');
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

      <div className="grid gap-4">
        {packages.map((pkg) => {
          const isExpanded = expandedPackages.has(pkg.id);
          return (
            <Card key={pkg.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader 
                onClick={() => togglePackageExpansion(pkg.id)}
                className="pb-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {pkg.package_name}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Created: {new Date(pkg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {pkg.documents.length} Document{pkg.documents.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent>
                  <div className="space-y-4">
                    <h4 className="font-medium">Documents:</h4>
                    <div className="grid gap-3">
                      {pkg.documents.map((doc, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium">{doc.name}</h5>
                            <Badge variant="outline" className="text-xs">
                              {doc.document.length} file{doc.document.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {doc.document.map((url, urlIndex) => (
                              <div key={urlIndex} className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0 text-sm"
                                  onClick={() => openDocument(url)}
                                >
                                  <span className="truncate max-w-[300px]">
                                    {url.includes('docs.google.com') ? 'Google Document' : url}
                                  </span>
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PackagesCarousel;
