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
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronLeft, ChevronRight, Check, Coins, Building2, Package, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import CreditsDisplay from '@/components/CreditsDisplay';
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
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { credits, checkCredits, deductCredits, getCreditCost } = useCredits();

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('advisorpro-api', {
        body: {
          endpoint: 'coach-packages',
          method: 'GET'
        }
      });

      if (error) {
        console.error('Error calling advisorpro-api:', error);
        toast.error('Failed to load packages');
        return;
      }

      if (data && data.data && data.data.success) {
        const coachPackages = data.data.data.map((pkg: any) => ({
          id: pkg.id,
          title: pkg.name,
          description: pkg.description || '',
          icon: '',
          items: pkg.documents?.map((doc: any) => doc.name) || []
        }));
        setPackages(coachPackages);
      } else {
        console.error('Failed to fetch coach packages:', data);
        toast.error('Failed to load packages');
      }
    } catch (error) {
      console.error('Error fetching coach packages:', error);
      toast.error('Failed to load packages');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
      fetchPackages();
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
    const packageCost = getCreditCost(packageId as keyof typeof getCreditCost);
    const hasEnoughCreditsForPackage = checkCredits(packageCost);
    
    // If user doesn't have enough credits and is trying to select, show error and return
    if (!hasEnoughCreditsForPackage && !selectedPackages.includes(packageId)) {
      toast.error(`You need ${packageCost} credits for this package but only have ${credits?.credits || 0} credits.`);
      return;
    }

    setSelectedPackages(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };

  const getTotalCost = () => {
    return selectedPackages.reduce((total, packageId) => {
      return total + getCreditCost(packageId as keyof typeof getCreditCost);
    }, 0);
  };

  const hasEnoughCredits = checkCredits(getTotalCost());

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

    const totalCost = getTotalCost();
    
    if (!hasEnoughCredits) {
      toast.error(`Insufficient credits. You need ${totalCost} credits but only have ${credits?.credits || 0}.`);
      return;
    }

    setIsLoading(true);
    try {
      // Deduct credits first
      const creditDeducted = await deductCredits(
        totalCost,
        `Package creation: ${selectedPackages.length} package(s)`,
        'PACKAGE_CREATION'
      );

      if (!creditDeducted) {
        setIsLoading(false);
        return;
      }

      const selectedCompanyData = companies.find(c => c.id === selectedCompany);

      // Prepare query parameters
      const params = new URLSearchParams();
      params.append('user_id', user.id);
      params.append('user_email', user.email || '');
      params.append('user_name', user.user_metadata?.name || 'Unknown User');
      params.append('company_name', selectedCompanyData?.company_name || '');
      params.append('company_id', selectedCompany);
      params.append('package_count', selectedPackages.length.toString());
      params.append('total_credits_deducted', totalCost.toString());
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
      
      toast.success(`Package request submitted successfully! ${totalCost} credits deducted.`);
      
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

  const pageSteps = [
    { number: 1, title: 'Select Company', icon: Building2, description: 'Choose your company' },
    { number: 2, title: 'Choose Packages', icon: Package, description: 'Pick your packages' },
    { number: 3, title: 'Review & Submit', icon: Check, description: 'Confirm your order' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-0 top-0 bottom-0 h-full w-[70vw] max-w-4xl overflow-hidden p-0 flex flex-col translate-x-0 translate-y-0 rounded-none border-0 shadow-2xl bg-gradient-to-br from-background via-background to-muted/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left data-[state=closed]:duration-300 data-[state=open]:duration-300">
        {/* Enhanced Header with gradient background */}
        <DialogHeader className="relative p-8 pb-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Create Package
                  </DialogTitle>
                  {preSelectedCompany && (
                    <p className="text-lg text-muted-foreground mt-1">
                      for <span className="font-medium text-foreground">{preSelectedCompany}</span>
                    </p>
                  )}
                </div>
              </div>
              <CreditsDisplay />
            </div>

            {/* Enhanced Progress Steps */}
            <div className="flex items-center justify-between mb-6">
              {pageSteps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                      ${currentPage === step.number 
                        ? 'bg-primary border-primary text-primary-foreground shadow-lg scale-110' 
                        : currentPage > step.number 
                          ? 'bg-primary/20 border-primary text-primary' 
                          : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                      }
                    `}>
                      {currentPage > step.number ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${currentPage === step.number ? 'text-primary' : 'text-muted-foreground'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {index < pageSteps.length - 1 && (
                    <div className={`
                      w-24 h-0.5 mx-4 mt-[-2rem] transition-colors duration-300
                      ${currentPage > step.number ? 'bg-primary' : 'bg-muted-foreground/30'}
                    `} />
                  )}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <Progress value={(currentPage / 3) * 100} className="w-full h-2 bg-muted/50" />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Page 1: Select Company */}
            {currentPage === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-6">
                  <div className="mx-auto w-64 h-64 relative">
                    <img 
                      src="/lovable-uploads/select.png" 
                      alt="Select Company" 
                      className="w-full h-full object-contain rounded-2xl shadow-lg"
                    />
                    <div className="absolute -bottom-4 -right-4 p-3 bg-primary/10 rounded-full">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">Select Your Company</h3>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      Choose the company you'd like to create a package for. This will help us tailor the content to your specific business needs and goals.
                    </p>
                  </div>
                </div>
                
                <Card className="max-w-md mx-auto border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors duration-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        Company Selection
                      </label>
                      <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                        <SelectTrigger className="w-full h-12 text-base">
                          <SelectValue placeholder="Choose a company..." />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.length > 0 ? (
                            companies.map((company) => (
                              <SelectItem key={company.id} value={company.id} className="py-3">
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
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Page 2: Select Packages */}
            {currentPage === 2 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Select Package(s)</h3>
                  </div>
                  <p className="text-lg text-muted-foreground">Multiple selections allowed</p>
                  {selectedPackages.length > 0 && (
                    <div className="flex items-center justify-center gap-3">
                      <Badge variant="outline" className="gap-2 text-base px-4 py-2">
                        <Coins className="h-4 w-4" />
                        Total cost: {getTotalCost()} credits
                      </Badge>
                      {!hasEnoughCredits && (
                        <Badge variant="destructive" className="gap-2 text-base px-4 py-2">
                          Insufficient credits ({credits?.credits || 0} available)
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid gap-6 max-w-4xl mx-auto">
                  {packages.map((pkg) => {
                    const packageCost = getCreditCost(pkg.id as keyof typeof getCreditCost);
                    const hasEnoughCreditsForPackage = checkCredits(packageCost);
                    const isSelected = selectedPackages.includes(pkg.id);
                    const isDisabled = !hasEnoughCreditsForPackage && !isSelected;
                    
                    return (
                      <Card 
                        key={pkg.id}
                        className={`
                          transition-all duration-300 cursor-pointer group
                          ${isSelected
                            ? 'ring-2 ring-primary bg-gradient-to-r from-primary/5 to-primary/10 shadow-lg scale-[1.02] border-primary/50'
                            : isDisabled
                            ? 'opacity-50 cursor-not-allowed bg-muted/30'
                            : 'hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/50 hover:shadow-md hover:scale-[1.01] border-border'
                          }
                        `}
                        onClick={() => !isDisabled && handlePackageToggle(pkg.id)}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start gap-4">
                            <Checkbox 
                              checked={isSelected}
                              disabled={isDisabled}
                              onCheckedChange={() => !isDisabled && handlePackageToggle(pkg.id)}
                              className="mt-1 scale-125"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <CardTitle className={`text-lg leading-tight group-hover:text-primary transition-colors ${isDisabled ? 'text-muted-foreground' : ''}`}>
                                  {pkg.title}
                                </CardTitle>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <Badge variant="outline" className="gap-1 text-sm px-3 py-1">
                                    <Coins className="h-3 w-3" />
                                    {packageCost}
                                  </Badge>
                                  {isDisabled && (
                                    <Badge variant="destructive" className="text-xs">
                                      Insufficient credits
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="details" className="border-none">
                              <AccordionTrigger className={`text-base hover:no-underline py-3 ${isDisabled ? 'text-muted-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                                {pkg.description}
                              </AccordionTrigger>
                              <AccordionContent className="pb-0">
                                <div className="space-y-2 pt-3">
                                  {pkg.items.map((item, index) => (
                                    <div key={index} className={`text-sm flex items-start gap-3 p-2 rounded-lg ${isDisabled ? 'text-muted-foreground/70' : 'text-muted-foreground bg-muted/30'}`}>
                                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                      <span>{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Page 3: Review & Confirm */}
            {currentPage === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Check className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Review & Confirm</h3>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    Please review your selections before submitting
                  </p>
                </div>
                
                <div className="space-y-6 max-w-3xl mx-auto">
                  {/* Selected Company section */}
                  <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50">
                    <CardHeader className="pb-4">
                      <h4 className="font-semibold text-lg flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        Selected Company
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary" className="text-base font-medium px-4 py-2">
                        <Building2 className="h-4 w-4 mr-2" />
                        {selectedCompanyName}
                      </Badge>
                    </CardContent>
                  </Card>

                  {/* Selected Packages section */}
                  <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          Selected Packages ({selectedPackages.length})
                        </h4>
                        <Badge variant="outline" className="gap-2 text-base px-4 py-2">
                          <Coins className="h-4 w-4" />
                          Total: {getTotalCost()} credits
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {!hasEnoughCredits && (
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                          <div className="flex items-center gap-3 text-destructive">
                            <Coins className="h-5 w-5" />
                            <span className="font-medium">
                              Insufficient credits: You need {getTotalCost()} but only have {credits?.credits || 0}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="grid gap-4">
                        {selectedPackageDetails.map((pkg) => {
                          const packageCost = getCreditCost(pkg.id as keyof typeof getCreditCost);
                          return (
                            <Card key={pkg.id} className="bg-background/80 backdrop-blur-sm">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base flex items-center gap-2">
                                    {pkg.title}
                                  </CardTitle>
                                  <Badge variant="outline" className="gap-1">
                                    <Coins className="h-3 w-3" />
                                    {packageCost}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{pkg.description}</p>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="text-sm space-y-1">
                                  {pkg.items.map((item, index) => (
                                    <div key={index} className="flex items-start gap-2 text-muted-foreground">
                                      <Check className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                      <span>{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Navigation Footer */}
        <div className="flex justify-between items-center p-8 pt-6 border-t bg-gradient-to-r from-muted/30 to-muted/50 backdrop-blur-sm">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentPage === 1}
            className="min-w-[120px] h-12 text-base gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          {currentPage < 3 ? (
            <Button 
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="min-w-[120px] h-12 text-base gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || selectedPackages.length === 0 || !hasEnoughCredits}
              className="min-w-[180px] h-12 text-base gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Submit Request ({getTotalCost()} credits)
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePackageDialog;
