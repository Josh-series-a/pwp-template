
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package } from 'lucide-react';

interface ReportHeaderProps {
  reportTitle: string;
  companyName: string;
  createdAt?: string;
  onBackClick: () => void;
  onCreatePackageClick: () => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
  reportTitle,
  companyName,
  createdAt,
  onBackClick,
  onCreatePackageClick
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBackClick}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reports
        </Button>
        
        <Button 
          onClick={onCreatePackageClick}
          className="flex items-center gap-2"
        >
          <Package className="h-4 w-4" />
          Create Package
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>{reportTitle}</span>
          </CardTitle>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Company: {companyName}</span>
            {createdAt && (
              <span>Generated: {new Date(createdAt).toLocaleDateString()}</span>
            )}
          </div>
        </CardHeader>
      </Card>
    </>
  );
};

export default ReportHeader;
