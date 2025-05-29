
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import GoogleDocPreviewer from '@/components/GoogleDocPreviewer';

const PackageDetail = () => {
  const { companySlug, exerciseId, reportId, packageId } = useParams();
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleBackToReport = () => {
    navigate(`/dashboard/reports/${companySlug}/${exerciseId}/${reportId}`);
  };

  const documents = [
    {
      url: 'https://docs.google.com/document/d/1D-MHsXuKA1EeZzARQA3XW8eF8d1j6U-rxKcFU_CR7As/edit?usp=drive_link',
      title: 'Business Legacy Plan - Document 1',
      description: 'Strategic planning and business foundation'
    },
    {
      url: 'https://docs.google.com/document/d/1kuNM_OYoJykQb9Qw8un-8KQc_N_v8fpm82aBQzNep_0/edit?usp=drive_link',
      title: 'Business Legacy Plan - Document 2',
      description: 'Operational excellence and processes'
    },
    {
      url: 'https://docs.google.com/document/d/1rimSYTJtoBge0ivtcFeiR7kOKaxZpbSokGXNu8VoGgo/edit?usp=drive_link',
      title: 'Business Legacy Plan - Document 3',
      description: 'Financial planning and sustainability'
    },
    {
      url: 'https://docs.google.com/document/d/12xzDB8dHSZJ_E7xZ4v5pE-Oclwr8B0eN5FfgiydB7aQ/edit?usp=drive_link',
      title: 'Business Legacy Plan - Document 4',
      description: 'Implementation and next steps'
    }
  ];

  const handleDocumentClick = (doc: any) => {
    setSelectedDoc(doc);
    setIsPreviewOpen(true);
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <DashboardLayout title="Package Documents">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToReport}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Report
          </Button>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Plan Your Business Legacy with Confidence
            </h1>
            <p className="text-lg text-gray-600">
              Package ID: {packageId}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.map((doc, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:scale-105 transform"
                onClick={() => handleDocumentClick(doc)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-center">{doc.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 text-center mb-4">
                    {doc.description}
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        openInNewTab(doc.url);
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                {selectedDoc?.title}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openInNewTab(selectedDoc?.url)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="h-[70vh]">
              {selectedDoc && (
                <GoogleDocPreviewer
                  docUrl={selectedDoc.url}
                  title={selectedDoc.title}
                  height="100%"
                  showUrlInput={false}
                  className="w-full h-full"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PackageDetail;
