
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, FileText, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
            'Authorization': `Bearer ${supabase.supabaseKey}`,
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

  const nextPackage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === packages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPackage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? packages.length - 1 : prevIndex - 1
    );
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

  const currentPackage = packages[currentIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Generated Packages ({packages.length})</h3>
        {packages.length > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPackage}
              disabled={packages.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {packages.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPackage}
              disabled={packages.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{currentPackage.package_name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Created: {new Date(currentPackage.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="secondary">
              {currentPackage.documents.length} Document{currentPackage.documents.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-medium">Documents:</h4>
            <div className="grid gap-3">
              {currentPackage.documents.map((doc, index) => (
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
      </Card>
    </div>
  );
};

export default PackagesCarousel;
