import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CreatePackageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedCompany?: string;
  reportId?: string;
  statusType?: string;
  companyId?: string;
}

interface Company {
  id: string;
  company_name: string;
  created_at: string;
}

interface Package {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: string[];
}

const packages: Package[] = [
  {
    id: 'PYBLC1',
    title: 'Plan Your Business Legacy with Confidence',
    description: '🧭 For founders who want to build with the end in mind and reduce long-term stress.',
    icon: '🧭',
    items: [
      'Founder Exit Strategy Report',
      'Exit Readiness Blueprint Report',
      'Stress-Free Exit Roadmap Report',
      'Legacy & Exit Planning Report'
    ]
  },
  {
    id: 'USICD2',
    title: 'Understand and Serve Your Ideal Customers Deeply',
    description: '🔍 For teams that want to sharpen their customer insight and increase resonance.',
    icon: '🔍',
    items: [
      'Know Your Customer Persona Toolkit (Exercise 6)',
      'Customer Journey Mapping Workshops',
      'Ideal Customer Profile Scorecard',
      'Engagement Strategy Plan'
    ]
  },
  {
    id: 'DIIP3',
    title: 'Differentiate Yourself with an Irresistible Proposition',
    description: '💡 For companies struggling to stand out in crowded markets.',
    icon: '💡',
    items: [
      '1+1 Proposition Creation Workshop (Exercise 7)',
      'Strategic Differentiation Playbook',
      'Emotional Hook Messaging Templates',
      'Customer Delight Blueprint'
    ]
  },
  {
    id: 'ETYSDD4',
    title: 'Empower Your Team and Step Back from the Day-to-Day',
    description: '🛠️ For founders stuck in the weeds and seeking more freedom.',
    icon: '🛠️',
    items: [
      'Delegation Audit and Scorecard (Exercise 18)',
      'Leadership Empowerment Workshops',
      'Team Accountability & Development Toolkit',
      'Freedom Framework: Reducing Founder Bottlenecks'
    ]
  },
  {
    id: 'SGKCR5',
    title: 'Strengthen and Grow Your Key Customer Relationships',
    description: '🤝 For businesses ready to scale revenue through strategic client relationships.',
    icon: '🤝',
    items: [
      'Key Customer Mapping and Insights (Exercise 27)',
      'Customer Relationship Management (CRM) Playbook',
      'Second-Order Sales Strategy Plan (based on Chapter 23)',
      'Relationship Building and Loyalty Tools'
    ]
  }
];

const CreatePackageDialog: React.FC<CreatePackageDialogProps> = ({ 
  isOpen, 
  onClose, 
  preSelectedCompany,
  reportId,
  statusType,
  companyId
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
    }
  }, [isOpen, user]);

  useEffect(() => {
    // Auto-select the pre-selected company when companies are loaded
    if (preSelectedCompany && companies.length > 0) {
      const matchingCompany = companies.find(c => c.company_name === preSelectedCompany);
      if (matchingCompany) {
        setSelectedCompany(matchingCompany.id);
        // Auto-advance to page 2 since company is pre-selected
        setCurrentPage(2);
      }
    }
  }, [preSelectedCompany, companies]);

  // Reset dialog state when it opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(preSelectedCompany ? 2 : 1);
      setSelectedCompany('');
      setSelectedPackages([]);
    }
  }, [isOpen, preSelectedCompany]);

  const fetchCompanies = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('company_name, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Get unique companies
        const uniqueCompanies = data.reduce((acc: Company[], report) => {
          if (!acc.find(c => c.company_name === report.company_name)) {
            acc.push({
              id: report.company_name.toLowerCase().replace(/\s+/g, '-'),
              company_name: report.company_name,
              created_at: report.created_at
            });
          }
          return acc;
        }, []);
        
        setCompanies(uniqueCompanies);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
    }
  };

  const handlePackageToggle = (packageId: string) => {
    setSelectedPackages(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };

  const handleNext = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      const selectedCompanyData = companies.find(c => c.id === selectedCompany);
      const selectedPackageDetails = packages.filter(p => selectedPackages.includes(p.id));

      // Prepare query parameters
      const params = new URLSearchParams();
      params.append('user_id', user.id);
      params.append('user_email', user.email || '');
      params.append('user_name', user.user_metadata?.name || 'Unknown User');
      params.append('company_name', selectedCompanyData?.company_name || '');
      params.append('company_id', selectedCompany);
      params.append('package_count', selectedPackages.length.toString());
      params.append('timestamp', new Date().toISOString());
      params.append('submitted_from', 'Create Package Dialog');
      
      // Add new parameters for reportId, statusType, and companyId
      if (reportId) {
        params.append('report_id', reportId);
      }
      if (statusType) {
        params.append('status_type', statusType);
      }
      if (companyId) {
        params.append('new_company_id', companyId);
      }
      
      // Add selected packages as separate parameters (only ID and title)
      selectedPackageDetails.forEach((pkg, index) => {
        params.append(`package_${index}_id`, pkg.id);
        params.append(`package_${index}_title`, pkg.title);
      });

      console.log('Sending data to webhook as query string:', params.toString());

      // Send to webhook with query parameters
      const webhookUrl = 'https://hook.eu2.make.com/aha19x6d2fppxppp3kvuzws49rknm31p';
      
      await fetch(`${webhookUrl}?${params.toString()}`, {
        method: 'GET',
        mode: 'no-cors',
      });

      console.log('Webhook data sent successfully');
      
      toast.success(`Package request submitted successfully for ${selectedCompanyData?.company_name}!`);
      
      // Reset form
      setCurrentPage(1);
      setSelectedCompany('');
      setSelectedPackages([]);
      onClose();
    } catch (error) {
      console.error('Error submitting package request:', error);
      toast.error('Failed to submit package request');
    } finally {
      setIsLoading(false);
    }
  };

  const isNextDisabled = () => {
    if (currentPage === 1) return !selectedCompany;
    if (currentPage === 2) return selectedPackages.length === 0;
    return false;
  };

  const selectedCompanyName = companies.find(c => c.id === selectedCompany)?.company_name;
  const selectedPackageDetails = packages.filter(p => selectedPackages.includes(p.id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Create Package - Page {currentPage} of 3
            {preSelectedCompany && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                for {preSelectedCompany}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Page 1: Select Company */}
          {currentPage === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Company</h3>
              <div className="grid gap-3">
                {companies.length > 0 ? (
                  companies.map((company) => (
                    <Card 
                      key={company.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedCompany === company.id 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedCompany(company.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{company.company_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Added {new Date(company.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {selectedCompany === company.id && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground">No companies found. Create a report first.</p>
                )}
              </div>
            </div>
          )}

          {/* Page 2: Select Packages */}
          {currentPage === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Package(s)</h3>
              <p className="text-sm text-muted-foreground">Multiple selections allowed</p>
              <div className="grid gap-4">
                {packages.map((pkg) => (
                  <Card 
                    key={pkg.id}
                    className={`cursor-pointer transition-colors ${
                      selectedPackages.includes(pkg.id)
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handlePackageToggle(pkg.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={selectedPackages.includes(pkg.id)}
                          onChange={() => handlePackageToggle(pkg.id)}
                        />
                        <div className="flex-1">
                          <CardTitle className="text-base">{pkg.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pkg.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1">
                        {pkg.items.map((item, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            • {item}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Page 3: Review & Confirm */}
          {currentPage === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review & Confirm Selections</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Selected Company:</h4>
                  <Badge variant="secondary" className="text-sm">
                    {selectedCompanyName}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Selected Packages ({selectedPackages.length}):</h4>
                  <div className="space-y-3">
                    {selectedPackageDetails.map((pkg) => (
                      <Card key={pkg.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{pkg.title}</CardTitle>
                          <p className="text-xs text-muted-foreground">{pkg.description}</p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-muted-foreground space-y-1">
                            {pkg.items.map((item, index) => (
                              <div key={index}>• {item}</div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentPage < 3 ? (
              <Button 
                onClick={handleNext}
                disabled={isNextDisabled()}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isLoading || selectedPackages.length === 0}
              >
                {isLoading ? 'Submitting...' : 'Submit Package Request'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePackageDialog;
