import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, ExternalLink } from 'lucide-react';
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
      description: 'Strategic planning and business foundation',
      thumbnail: 'https://lh3.googleusercontent.com/d/1D-MHsXuKA1EeZzARQA3XW8eF8d1j6U-rxKcFU_CR7As=w1000?authuser=0'
    },
    {
      url: 'https://docs.google.com/document/d/1kuNM_OYoJykQb9Qw8un-8KQc_N_v8fpm82aBQzNep_0/edit?usp=drive_link',
      title: 'Business Legacy Plan - Document 2',
      description: 'Operational excellence and processes',
      thumbnail: 'https://lh3.googleusercontent.com/d/1kuNM_OYoJykQb9Qw8un-8KQc_N_v8fpm82aBQzNep_0=w1000?authuser=0'
    },
    {
      url: 'https://docs.google.com/document/d/1rimSYTJtoBge0ivtcFeiR7kOKaxZpbSokGXNu8VoGgo/edit?usp=drive_link',
      title: 'Business Legacy Plan - Document 3',
      description: 'Financial planning and sustainability',
      thumbnail: 'https://lh3.googleusercontent.com/d/1rimSYTJtoBge0ivtcFeiR7kOKaxZpbSokGXNu8VoGgo=w1000?authuser=0'
    },
    {
      url: 'https://docs.google.com/document/d/12xzDB8dHSZJ_E7xZ4v5pE-Oclwr8B0eN5FfgiydB7aQ/edit?usp=drive_link',
      title: 'Business Legacy Plan - Document 4',
      description: 'Implementation and next steps',
      thumbnail: 'https://lh3.googleusercontent.com/d/12xzDB8dHSZJ_E7xZ4v5pE-Oclwr8B0eN5FfgiydB7aQ=w1000?authuser=0'
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
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Plan Your Business Legacy with Confidence
            </h1>
            <p className="text-lg text-gray-600">
              Package ID: {packageId}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.map((doc, index) => (
              <div 
                key={index}
                className="relative cursor-pointer hover:scale-105 transform transition-all duration-200"
                onClick={() => handleDocumentClick(doc)}
              >
                <div className="w-full aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 shadow-md hover:shadow-lg">
                  <img 
                    src={doc.thumbnail} 
                    alt={doc.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute bottom-2 right-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      openInNewTab(doc.url);
                    }}
                    className="shadow-lg"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
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
