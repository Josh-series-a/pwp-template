
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
  onSubmitComplete: (companyName: string, exerciseTitle: string) => void;
}

const RunAnalysisModal: React.FC<RunAnalysisModalProps> = ({ 
  isOpen, 
  onClose,
  onSubmitComplete
}) => {
  const [activeTab, setActiveTab] = useState('new-company');
  const { user } = useAuth();

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
            <TabsTrigger value="existing-company">Existing Company</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new-company" className="mt-4">
            <NewCompanyForm onComplete={onSubmitComplete} userData={user} />
          </TabsContent>
          
          <TabsContent value="existing-company" className="mt-4">
            <ExistingCompanyForm onComplete={onSubmitComplete} userData={user} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RunAnalysisModal;
