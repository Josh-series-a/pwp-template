import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import CustomDocumentViewer from '@/components/CustomDocumentViewer';
import { packageService } from '@/utils/packageService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getDocumentPreviewUrl, isGoogleDocument } from '@/components/documents/utils/document-utils';

interface Document {
  name: string;
  document: string[];
}

interface Package {
  id: string;
  package_name: string;
  documents: Document[];
  created_at: string;
  user_id: string;
  report_id: string;
}

const PackageDetail = () => {
  const { companySlug, exerciseId, reportId, packageId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPackageData();
  }, [packageId, reportId, user]);

  const fetchPackageData = async () => {
    if (!reportId || !packageId) return;
    
    setIsLoading(true);
    try {
      const packages = await packageService.getPackages(reportId, user?.id);
      const currentPackage = packages.find(pkg => pkg.id === packageId);
      
      if (currentPackage) {
        setPackageData(currentPackage);
      } else {
        toast.error('Package not found');
        navigate(`/dashboard/reports/${companySlug}/${exerciseId}/${reportId}`);
      }
    } catch (error) {
      console.error('Error fetching package data:', error);
      toast.error('Failed to load package data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToReport = () => {
    navigate(`/dashboard/reports/${companySlug}/${exerciseId}/${reportId}`);
  };

  const handleDocumentClick = (doc: any) => {
    const params = new URLSearchParams({
      url: encodeURIComponent(doc.url),
      title: encodeURIComponent(doc.title)
    });
    navigate(`/dashboard/reports/${companySlug}/${exerciseId}/${reportId}/${packageId}/preview?${params.toString()}`);
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Loading Package...">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading package details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!packageData) {
    return (
      <DashboardLayout title="Package Not Found">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Package Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested package could not be found.
            </p>
            <Button onClick={handleBackToReport}>
              Back to Report
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              {packageData.package_name}
            </h1>
            <p className="text-lg text-gray-600">
              Package ID: {packageData.id}
            </p>
            <p className="text-sm text-muted-foreground">
              Created: {new Date(packageData.created_at).toLocaleDateString()} • Total Cost: {(packageData.documents?.length || 0) * 5} Credits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packageData.documents.map((doc, index) => {
              const docUrl = doc.document[0];
              const isGoogleDoc = isGoogleDocument(docUrl);
              const thumbnailUrl = isGoogleDoc ? getDocumentPreviewUrl(docUrl, 'w800') : null;
              
              return (
                <div key={index}>
                  <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden">
                    {thumbnailUrl && (
                      <div 
                        className="relative overflow-hidden bg-muted cursor-pointer" 
                        style={{ aspectRatio: '1/1.414' }}
                        onClick={() => handleDocumentClick({
                          title: doc.name,
                          url: doc.document[0]
                        })}
                      >
                        <img 
                          src={thumbnailUrl}
                          alt={`${doc.name} preview`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Hide thumbnail if it fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {doc.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          {doc.document.length} document{doc.document.length !== 1 ? 's' : ''} • 5 Credits
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDocumentClick({
                              title: doc.name,
                              url: doc.document[0]
                            })}
                          >
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => openInNewTab(doc.document[0])}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {packageData.documents.length === 0 && (
            <Card className="p-8">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Documents</h3>
                <p className="text-muted-foreground">
                  This package doesn't contain any documents yet.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PackageDetail;
