
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import GoogleDocPreviewer from '@/components/GoogleDocPreviewer';

const PackageDetail = () => {
  const { companySlug, exerciseId, reportId, packageId } = useParams();
  const navigate = useNavigate();

  const handleBackToReport = () => {
    navigate(`/dashboard/reports/${companySlug}/${exerciseId}/${reportId}`);
  };

  const documents = [
    {
      url: 'https://docs.google.com/document/d/1D-MHsXuKA1EeZzARQA3XW8eF8d1j6U-rxKcFU_CR7As/edit?usp=drive_link',
      title: 'Business Legacy Plan - Document 1'
    },
    {
      url: 'https://docs.google.com/document/d/1kuNM_OYoJykQb9Qw8un-8KQc_N_v8fpm82aBQzNep_0/edit?usp=drive_link',
      title: 'Business Legacy Plan - Document 2'
    },
    {
      url: 'https://docs.google.com/document/d/1rimSYTJtoBge0ivtcFeiR7kOKaxZpbSokGXNu8VoGgo/edit?usp=drive_link',
      title: 'Business Legacy Plan - Document 3'
    },
    {
      url: 'https://docs.google.com/document/d/12xzDB8dHSZJ_E7xZ4v5pE-Oclwr8B0eN5FfgiydB7aQ/edit?usp=drive_link',
      title: 'Business Legacy Plan - Document 4'
    }
  ];

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

          <div className="grid gap-8">
            {documents.map((doc, index) => (
              <GoogleDocPreviewer
                key={index}
                docUrl={doc.url}
                title={doc.title}
                height="800px"
                showUrlInput={false}
                className="w-full"
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PackageDetail;
