
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
            <div key={pkg.id} className="space-y-3">
              {/* Package Name Card with Gradient */}
              <div 
                onClick={() => togglePackageExpansion(pkg.id)}
                className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 p-8">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                        {pkg.package_name}
                      </h2>
                      <p className="text-lg font-medium text-gray-800">
                        {pkg.documents.length} Document{pkg.documents.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="ml-4">
                      {isExpanded ? (
                        <ChevronUp className="h-6 w-6 text-gray-700" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-gray-700" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Expanded Documents Section */}
              {isExpanded && (
                <Card className="border-l-4 border-l-yellow-400">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-lg">Documents:</h4>
                        <Badge variant="outline" className="text-sm">
                          Created: {new Date(pkg.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                      <div className="grid gap-4">
                        {pkg.documents.map((doc, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="font-medium text-lg">{doc.name}</h5>
                              <Badge variant="secondary" className="text-xs">
                                {doc.document.length} file{doc.document.length !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {doc.document.map((url, urlIndex) => (
                                <div key={urlIndex} className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors">
                                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-left font-medium"
                                    onClick={() => openDocument(url)}
                                  >
                                    <span className="truncate max-w-[400px]">
                                      {url.includes('docs.google.com') ? 'Google Document' : url}
                                    </span>
                                    <ExternalLink className="h-4 w-4 ml-2 flex-shrink-0" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PackagesCarousel;
