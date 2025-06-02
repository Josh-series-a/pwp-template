
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SubPillarsRenderer from './SubPillarsRenderer';

interface BusinessHealthData {
  id: string;
  client_id: string;
  tab_id: string;
  report_id: string | null;
  overview: string | null;
  purpose: string | null;
  sub_pillars: any;
  total_score: number | null;
  created_at: string;
  updated_at: string;
  recommended_ciks?: string[];
}

interface ReportTabContentProps {
  tabId: string;
  defaultTitle: string;
  defaultDescription: string;
  businessHealthData: Record<string, BusinessHealthData>;
}

const ReportTabContent: React.FC<ReportTabContentProps> = ({
  tabId,
  defaultTitle,
  defaultDescription,
  businessHealthData
}) => {
  console.log(`Rendering tab ${tabId}, available data:`, Object.keys(businessHealthData));
  const tabData = businessHealthData[tabId];
  
  if (!tabData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{defaultTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">{defaultDescription}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>No data available:</strong> The business health analysis for this section may still be processing, 
                or the data hasn't been generated yet. Please check back later or contact support if this persists.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {defaultTitle}
            {tabData.total_score && (
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full">
                Overall Score: {tabData.total_score}/10
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tabData.overview && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Overview</h4>
              <p className="text-muted-foreground">{tabData.overview}</p>
            </div>
          )}
          
          {tabData.purpose && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Purpose</h4>
              <p className="text-muted-foreground">{tabData.purpose}</p>
            </div>
          )}
          
          <SubPillarsRenderer subPillars={tabData.sub_pillars} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportTabContent;
