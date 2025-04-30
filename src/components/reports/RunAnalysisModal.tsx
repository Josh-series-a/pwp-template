
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
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
  onSubmitComplete: (companyName: string, exerciseTitle: string, pitchDeckUrl?: string) => void;
}

const RunAnalysisModal: React.FC<RunAnalysisModalProps> = ({ 
  isOpen, 
  onClose,
  onSubmitComplete
}) => {
  const [activeTab, setActiveTab] = useState('new-company');
  const { user } = useAuth();

  const handleSubmitComplete = (companyName: string, exerciseTitle: string, pitchDeckUrl?: string) => {
    console.log("Analysis complete with pitchDeckUrl:", pitchDeckUrl);
    onSubmitComplete(companyName, exerciseTitle, pitchDeckUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Run New Analysis</DialogTitle>
          <DialogDescription>
            Complete the following steps to run a new business health analysis
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="new-company" value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-company">New Company</TabsTrigger>
            <TabsTrigger value="existing-company" disabled className="opacity-50 cursor-not-allowed">
              Existing Company (Coming Soon)
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="new-company" className="mt-4">
            <NewCompanyForm onComplete={handleSubmitComplete} userData={user} />
          </TabsContent>
          
          <TabsContent value="existing-company" className="mt-4">
            <ExistingCompanyForm onComplete={handleSubmitComplete} userData={user} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RunAnalysisModal;
