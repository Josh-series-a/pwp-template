
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
      <SheetContent side="left" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-3 pb-6">
          <SheetTitle className="text-2xl font-semibold">Run Business Health Score</SheetTitle>
          <SheetDescription className="text-base">
            Complete the following steps to run a new business health analysis
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="new-company" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="new-company" className="text-sm font-medium">New Company</TabsTrigger>
            <TabsTrigger value="existing-company" className="text-sm font-medium">Existing Company</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new-company" className="mt-0">
            <NewCompanyForm onComplete={handleSubmitComplete} userData={user} />
          </TabsContent>
          
          <TabsContent value="existing-company" className="mt-0">
            <ExistingCompanyForm onComplete={handleSubmitComplete} userData={user} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default RunAnalysisModal;
