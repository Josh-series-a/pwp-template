import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
import { ChevronLeft, Check, Coins, Building2, Package, Sparkles, ArrowRight, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/hooks/useCredits';
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
    if (preSelectedCompany && companies.length > 0) {
      const matchingCompany = companies.find(c => c.company_name === preSelectedCompany);
      if (matchingCompany) {
        setSelectedCompany(matchingCompany.id);
        setCurrentPage(2);
      }
    }
  }, [preSelectedCompany, companies]);

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
    const pkg = packages.find(p => p.id === packageId);
    const packageCost = pkg ? pkg.items.length * 5 : 0; // 5 credits per document
    const hasEnoughCreditsForPackage = checkCredits(packageCost);
    
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
      const pkg = packages.find(p => p.id === packageId);
      return total + (pkg ? pkg.items.length * 5 : 0); // 5 credits per document
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
      const selectedPackageData = packages.filter(p => selectedPackages.includes(p.id));

      const payload = {
        name: selectedPackageData[0]?.title || 'Custom Package',
        description: selectedPackageData[0]?.description || 'Custom package description',
        color: "#3b82f6",
        text_color: "#ffffff",
        documents: selectedPackageData.flatMap(pkg => pkg.items || []),
        user_id: user.id,
        client_id: reportId || `company_${selectedCompany}`, // Use reportId or fallback to company-based ID
        companyName: selectedCompanyData?.company_name || '',
        package_id: selectedPackages[0] || 'custom'
      };

      console.log('Sending package creation request:', payload);

      const { data, error } = await supabase.functions.invoke('advisorpro-api', {
        body: {
          endpoint: 'create-package',
          method: 'POST',
          body: payload
        }
      });

      if (error) {
        console.error('Error creating package:', error);
        toast.error('Failed to create package');
        return;
      }

      if (data && data.data && data.data.success) {
        console.log('Package created successfully:', data.data);
        toast.success(`Package created successfully! ${totalCost} credits deducted.`);
      } else {
        console.error('Package creation failed:', data);
        toast.error('Failed to create package');
        return;
      }
      
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
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 gap-0 bg-gradient-to-br from-background via-background/95 to-muted/30 overflow-hidden">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background/80 hover:bg-background z-50 shadow-md"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full overflow-hidden">
          {/* Left Panel - Navigation Section */}
          <div className="relative flex flex-col justify-center p-6 md:p-8 lg:p-12 bg-gradient-to-br from-primary/5 via-primary/3 to-background overflow-y-auto">
            <div className="max-w-lg mx-auto lg:mx-0 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-bold text-foreground">
                      Create Package
                    </DialogTitle>
                    {preSelectedCompany && (
                      <Badge variant="secondary" className="gap-2 px-3 py-1 mt-2">
                        <Building2 className="h-3 w-3" />
                        {preSelectedCompany}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Steps */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground mb-4">Package Creation Steps</h3>
                {pageSteps.map((step) => {
                  const IconComponent = step.icon;
                  const isActive = currentPage === step.number;
                  const isCompleted = currentPage > step.number;
                  
                  return (
                    <div
                      key={step.number}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-primary/10 border border-primary/20' 
                          : isCompleted 
                          ? 'bg-muted/50 border border-border/30' 
                          : 'bg-background/30 border border-border/20'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <IconComponent className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {step.description}
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.number}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Credits Display */}
              <div className="p-6 rounded-2xl bg-background/80 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Coins className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold">Available Credits</span>
                  </div>
                  <Badge variant="default" className="gap-2 px-3 py-1">
                    <Coins className="h-3 w-3" />
                    {credits?.credits || 0}
                  </Badge>
                </div>
                {selectedPackages.length > 0 && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                    <span className="text-sm text-muted-foreground">Total cost</span>
                    <span className="text-sm font-medium">{getTotalCost()} credits</span>
                  </div>
                )}
              </div>

              {/* Warning if insufficient credits */}
              {selectedPackages.length > 0 && !hasEnoughCredits && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
                  <div className="flex items-center gap-2 text-destructive">
                    <Coins className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Insufficient credits. You need {getTotalCost()} but have {credits?.credits || 0}.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl"></div>
          </div>

          {/* Right Panel - Form Section */}
          <div className="flex flex-col overflow-hidden min-h-0">
            <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12">
              <div className="max-w-2xl mx-auto h-full">
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
                          Choose the company you'd like to create a package for.
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
                        const packageCost = pkg.items.length * 5; // 5 credits per document
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
                              const packageCost = pkg.items.length * 5; // 5 credits per document
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

            {/* Navigation Footer */}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePackageDialog;