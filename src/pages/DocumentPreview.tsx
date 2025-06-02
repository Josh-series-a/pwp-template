
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import CustomDocumentViewer from '@/components/CustomDocumentViewer';

const DocumentPreview = () => {
  const { companySlug, exerciseId, reportId, packageId } = useParams();
  const navigate = useNavigate();
  
  // Get document info from URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const docUrl = searchParams.get('url');
  const docTitle = searchParams.get('title');

  const handleBackToPackage = () => {
    navigate(`/dashboard/reports/${companySlug}/${exerciseId}/${reportId}/${packageId}`);
  };

  const openInNewTab = () => {
    if (docUrl) {
      window.open(docUrl, '_blank');
    }
  };

  if (!docUrl || !docTitle) {
    return (
      <DashboardLayout title="Document Preview">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Invalid Document</h3>
            <p className="text-muted-foreground mb-4">
              Document information is missing.
            </p>
            <Button onClick={handleBackToPackage}>
              Back to Package
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={decodeURIComponent(docTitle)} hideHeader={true}>
      <div className="h-[calc(100vh-24px)] flex flex-col">
        <div className="flex-1 min-h-0">
          <CustomDocumentViewer
            docUrl={decodeURIComponent(docUrl)}
            title={decodeURIComponent(docTitle)}
            height="100%"
            showUrlInput={false}
            className="h-full"
            customHeaderButtons={
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBackToPackage}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Package
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openInNewTab}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Google Docs
                </Button>
              </div>
            }
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DocumentPreview;
