
import React, { useState } from 'react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Building2, Plus } from 'lucide-react';
import NewCompanyForm from './NewCompanyForm';
import ExistingCompanyForm from './ExistingCompanyForm';
import { useAuth } from '@/contexts/AuthContext';

interface RunAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitComplete: (companyName: string, exerciseTitle: string, pitchDeckUrl?: string, type?: string, companyId?: string) => void;
}

const RunAnalysisModal: React.FC<RunAnalysisModalProps> = ({ 
  isOpen, 
  onClose,
  onSubmitComplete
}) => {
  const [activeTab, setActiveTab] = useState('new-company');
  const { user } = useAuth();

  const handleSubmitComplete = (companyName: string, exerciseTitle: string, pitchDeckUrl?: string, companyId?: string) => {
    console.log("Analysis complete with pitchDeckUrl:", pitchDeckUrl, "and companyId:", companyId);
    const type = activeTab === 'new-company' ? 'New' : 'Existing';
    onSubmitComplete(companyName, exerciseTitle, pitchDeckUrl, type, companyId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-full sm:max-w-2xl overflow-y-auto m-4 h-[calc(100vh-2rem)] rounded-lg border-0 shadow-2xl bg-gradient-to-br from-background via-background to-muted/20"
      >
        <div className="relative">
          {/* Header Section */}
          <SheetHeader className="space-y-4 pb-8 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Run Business Health Score
                </SheetTitle>
                <Badge variant="secondary" className="mt-1 text-xs">
                  AI-Powered Analysis
                </Badge>
              </div>
            </div>
            <SheetDescription className="text-base text-muted-foreground leading-relaxed">
              Generate comprehensive business health insights using our AI-powered analysis framework. 
              Complete the steps below to receive personalized recommendations.
            </SheetDescription>
          </SheetHeader>

          {/* Content Section */}
          <div className="pt-6">
            <Tabs defaultValue="new-company" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="mb-8">
                <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-muted/50 rounded-xl">
                  <TabsTrigger 
                    value="new-company" 
                    className="text-sm font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Company
                  </TabsTrigger>
                  <TabsTrigger 
                    value="existing-company" 
                    className="text-sm font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Existing Company
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="space-y-6">
                <TabsContent value="new-company" className="mt-0 space-y-6">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/30 dark:border-blue-800/30">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mt-0.5">
                        <Plus className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">New Company Analysis</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Start fresh with a comprehensive business health assessment for a new company.
                        </p>
                      </div>
                    </div>
                  </div>
                  <NewCompanyForm onComplete={handleSubmitComplete} userData={user} />
                </TabsContent>
                
                <TabsContent value="existing-company" className="mt-0 space-y-6">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/30 dark:border-green-800/30">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 mt-0.5">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-green-900 dark:text-green-100">Existing Company Follow-up</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Track progress and generate updated insights for a previously analyzed company.
                        </p>
                      </div>
                    </div>
                  </div>
                  <ExistingCompanyForm onComplete={handleSubmitComplete} userData={user} />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RunAnalysisModal;
