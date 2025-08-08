import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react';
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

const PackageDocuments = () => {
  const { companySlug, reportId, packageName } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const packageIds = searchParams.get('packages')?.split(',') || [];
  const decodedPackageName = decodeURIComponent(packageName || '');
  const packageIdsString = packageIds.join(','); // Convert to string for stable dependency

  useEffect(() => {
    fetchPackageData();
  }, [reportId, packageIdsString, user?.id]); // Use stable string instead of array

  const fetchPackageData = async () => {
    if (!reportId) {
      console.log('No reportId provided');
      return;
    }
    
    console.log('Fetching package data for reportId:', reportId);
    console.log('Package IDs to filter:', packageIds);
    
    setIsLoading(true);
    try {
      const allPackages = await packageService.getPackages(reportId);
      console.log('All packages fetched:', allPackages);
      
      const filteredPackages = allPackages.filter(pkg => packageIds.includes(pkg.id));
      console.log('Filtered packages:', filteredPackages);
      
      if (filteredPackages.length === 0) {
        console.log('No packages found after filtering');
        toast.error('No packages found');
        navigate(`/dashboard/reports/${companySlug}/${reportId}`);
        return;
      }
      
      setPackages(filteredPackages);
      console.log('Packages set in state:', filteredPackages);
    } catch (error) {
      console.error('Error fetching package data:', error);
      toast.error('Failed to load package data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToReport = () => {
    navigate(`/dashboard/reports/${companySlug}/${reportId}?tab=packages`);
  };

  const handleDocumentClick = (doc: any, packageId: string) => {
    const params = new URLSearchParams({
      url: encodeURIComponent(doc.url),
      title: encodeURIComponent(doc.title)
    });
    navigate(`/dashboard/reports/${companySlug}/${reportId}/${packageId}/preview?${params.toString()}`);
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  const allDocuments = packages.flatMap(pkg => 
    pkg.documents.map(doc => ({
      ...doc,
      packageId: pkg.id,
      packageCreatedAt: pkg.created_at,
      versionNumber: packages.indexOf(pkg) + 1
    }))
  );

  console.log('All documents calculated:', allDocuments);
  console.log('All documents length:', allDocuments.length);

  if (isLoading) {
    return (
      <DashboardLayout title="Loading Documents...">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (packages.length === 0) {
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
    <DashboardLayout title={`${decodedPackageName} - Documents`}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToReport}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Packages
          </Button>
        </div>

        <div className="space-y-8">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {decodedPackageName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {allDocuments.length} documents across {packages.length} version{packages.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allDocuments.map((doc, index) => {
              const docUrl = doc.document[0];
              const isGoogleDoc = isGoogleDocument(docUrl);
              const thumbnailUrl = isGoogleDoc ? getDocumentPreviewUrl(docUrl, 'w800') : null;
              
              return (
                <div key={`${doc.packageId}-${index}`} className="w-full">
                  <div className="bg-white rounded-lg overflow-hidden">
                    {/* Document Thumbnail - Separate container */}
                    <div className="mb-4">
                      {thumbnailUrl ? (
                        <div 
                          className="relative overflow-hidden bg-muted cursor-pointer rounded-lg" 
                          style={{ aspectRatio: '1/1.414' }}
                          onClick={() => handleDocumentClick({
                            title: doc.name,
                            url: doc.document[0]
                          }, doc.packageId)}
                        >
                          <img 
                            src={thumbnailUrl}
                            alt={`${doc.name} preview`}
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div 
                          className="bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center cursor-pointer rounded-lg"
                          style={{ aspectRatio: '1/1.414' }}
                          onClick={() => handleDocumentClick({
                            title: doc.name,
                            url: doc.document[0]
                          }, doc.packageId)}
                        >
                          <FileText className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Document Info - Separate container */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                        {doc.name}
                      </h3>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {new Date(doc.packageCreatedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Separate container */}
                    <div className="flex justify-end items-center">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDocumentClick({
                            title: doc.name,
                            url: doc.document[0]
                          }, doc.packageId)}
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
                  </div>
                </div>
              );
            })}
          </div>

          {allDocuments.length === 0 && (
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

export default PackageDocuments;