import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, FileText, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  credits: number;
  components: number;
}

interface Package {
  id: string;
  name: string;
  description: string;
  color: string;
  text_color: string;
  credits: number;
  documents: Document[];
  created_at: string;
  visibility: string;
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
      const response = await fetch('/functions/v1/advisorpro-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: 'coach-packages',
          method: 'GET'
        })
      });

      const result = await response.json();
      
      if (result.data && result.data.success) {
        setPackages(result.data.data || []);
      } else {
        console.error('Failed to fetch coach packages:', result);
        toast.error('Failed to load packages');
      }
    } catch (error) {
      console.error('Error fetching coach packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setIsLoading(false);
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
              <div className="bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 h-full flex flex-col justify-between p-6">
                <div className="flex justify-end">
                  <ExternalLink className="h-5 w-5 text-gray-700" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight line-clamp-3">
                    {pkg.name}
                  </h2>
                  <p className="text-base font-medium text-gray-800">
                    {pkg.documents.length} Document{pkg.documents.length !== 1 ? 's' : ''} • {pkg.credits} Credits
                  </p>
                  <Badge variant="outline" className="text-xs bg-white/80 w-fit">
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
