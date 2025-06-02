
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, RefreshCw } from 'lucide-react';
import PackagesCarousel from '@/components/PackagesCarousel';
import { toast } from 'sonner';

interface PackagesTabProps {
  reportId: string;
  packagesCIKs: string[];
  report: any;
  user: any;
}

const PackagesTab: React.FC<PackagesTabProps> = ({ reportId, packagesCIKs, report, user }) => {
  const handleGeneratePackage = async () => {
    if (!user || !reportId || !report) {
      toast.error('Unable to generate package. Missing required information.');
      return;
    }

    try {
      // Sample package data - this would typically come from an AI analysis
      const packageData = {
        userId: user.id,
        reportId: reportId,
        package_name: "Plan Your Business Legacy with Confidence",
        documents: [
          {
            name: "Gap Analysis & Discussion Points",
            document: [
              "https://docs.google.com/document/d/1D-MHsXuKA1EeZzARQA3XW8eF8d1j6U-rxKcFU_CR7As/edit?tab=t.0"
            ]
          },
          {
            name: "Exit Strategy Framework",
            document: [
              "https://docs.google.com/document/d/1D-MHsXuKA1EeZzARQA3XW8eF8d1j6U-rxKcFU_CR7As/edit?tab=t.0"
            ]
          },
          {
            name: "Legacy Planning Workbook",
            document: [
              "https://docs.google.com/document/d/1D-MHsXuKA1EeZzARQA3XW8eF8d1j6U-rxKcFU_CR7As/edit?tab=t.0"
            ]
          }
        ]
      };

      const response = await fetch('https://eiksxjzbwzujepqgmxsp.supabase.co/functions/v1/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa3N4anpid3p1amVwcWdteHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTk4NTMsImV4cCI6MjA1ODM5NTg1M30.8DC-2c-QaqQlGbwrw2bNutDfTJYFFEPtPbzhWobZOLY`,
        },
        body: JSON.stringify(packageData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Package generated successfully!');
        // Refresh the packages carousel by triggering a re-render
        window.location.reload();
      } else {
        toast.error('Failed to generate package: ' + result.error);
      }
    } catch (error) {
      console.error('Error generating package:', error);
      toast.error('Failed to generate package');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button 
            onClick={handleGeneratePackage}
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Generate Package
          </Button>
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
