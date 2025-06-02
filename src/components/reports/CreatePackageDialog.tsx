
import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
      
      // Add selected packages IDs as separate array parameters
      selectedPackages.forEach((packageId) => {
        params.append('selected_packages_ID[]', packageId);
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="max-w-[90vw] w-full overflow-y-auto ml-8 mt-8 mb-8 mr-0 rounded-l-lg border-l flex flex-col">
        <SheetHeader className="mt-4">
          <SheetTitle>
            Create Package - Page {currentPage} of 3
            {preSelectedCompany && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                for {preSelectedCompany}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Progress Bar */}
        <div className="mt-6 mb-6">
          <Progress value={(currentPage / 3) * 100} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Select Company</span>
            <span>Choose Packages</span>
            <span>Review & Submit</span>
          </div>
        </div>

        <div className="flex-1 space-y-6 mt-6 mb-4">
          {/* Page 1: Select Company */}
          {currentPage === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-4">
                <img 
                  src="/lovable-uploads/select.png" 
                  alt="Select Company" 
                  className="mx-auto w-48 h-48 object-contain"
                />
                <div>
                  <h3 className="text-lg font-semibold">Select Company</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Choose the company you'd like to create a package for. This will help us tailor the content to your specific business needs.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Company</label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a company..." />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.length > 0 ? (
                      companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{company.company_name}</span>
                            <span className="text-xs text-muted-foreground">
                              Added {new Date(company.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-companies" disabled>
                        No companies found. Create a report first.
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Page 2: Select Packages */}
          {currentPage === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Select Package(s)</h3>
                <p className="text-sm text-muted-foreground">Multiple selections allowed</p>
              </div>
              <div className="grid gap-4">
                {packages.map((pkg) => (
                  <Card 
                    key={pkg.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedPackages.includes(pkg.id)
                        ? 'ring-2 ring-primary bg-primary/5 shadow-md'
                        : 'hover:bg-muted/50 hover:shadow-sm'
                    }`}
                    onClick={() => handlePackageToggle(pkg.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={selectedPackages.includes(pkg.id)}
                          onChange={() => handlePackageToggle(pkg.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <CardTitle className="text-base leading-tight">{pkg.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-2">
                            {pkg.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1">
                        {pkg.items.map((item, index) => (
                          <div key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
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
              <div className="text-center">
                <h3 className="text-lg font-semibold">Review & Confirm Selections</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Please review your selections before submitting
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Selected Company
                  </h4>
                  <Badge variant="secondary" className="text-sm font-medium">
                    {selectedCompanyName}
                  </Badge>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Selected Packages ({selectedPackages.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedPackageDetails.map((pkg) => (
                      <Card key={pkg.id} className="bg-background">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{pkg.title}</CardTitle>
                          <p className="text-xs text-muted-foreground">{pkg.description}</p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-muted-foreground space-y-1">
                            {pkg.items.map((item, index) => (
                              <div key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{item}</span>
                              </div>
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
        </div>

        {/* Navigation - Moved to bottom */}
        <div className="flex justify-between pt-4 border-t bg-background mt-auto mb-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentPage === 1}
            className="min-w-[100px]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {currentPage < 3 ? (
            <Button 
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="min-w-[100px]"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || selectedPackages.length === 0}
              className="min-w-[140px]"
            >
              {isLoading ? 'Submitting...' : 'Submit Package Request'}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreatePackageDialog;
