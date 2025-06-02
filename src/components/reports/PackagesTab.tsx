
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import PackagesCarousel from '@/components/PackagesCarousel';

interface PackagesTabProps {
  reportId: string;
  packagesCIKs: string[];
  report: any;
  user: any;
}

const PackagesTab: React.FC<PackagesTabProps> = ({ reportId, packagesCIKs }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        {packagesCIKs.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-sm font-medium text-muted-foreground">Recommended CIKs:</span>
            {packagesCIKs.slice(0, 5).map((cik, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {cik}
              </Badge>
            ))}
            {packagesCIKs.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{packagesCIKs.length - 5} more
              </Badge>
            )}
          </div>
        )}
      </div>
      <PackagesCarousel reportId={reportId} />
    </div>
  );
};

export default PackagesTab;
