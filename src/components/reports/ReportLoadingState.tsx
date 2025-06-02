
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const ReportLoadingState: React.FC = () => {
  return (
    <DashboardLayout title="Loading Report...">
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading report details...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportLoadingState;
