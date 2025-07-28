
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CompanyDetailsForm, { CompanyDetailsFormValues } from './forms/CompanyDetailsForm';
import StepSelector from './StepSelector';

interface NewCompanyFormProps {
  onComplete: (companyName: string, exerciseTitle: string, pitchDeckUrl?: string, companyId?: string) => void;
  userData: any;
}

const NewCompanyForm: React.FC<NewCompanyFormProps> = ({ onComplete, userData }) => {
  const step = 1; // Always step 1 since we only have one step
  const selectedExercise = 'business-health-score';
  const [companyId] = useState<string>(() => crypto.randomUUID());
  const { user } = useAuth();

  const onCompanyDetailsSubmit = async (data: CompanyDetailsFormValues) => {
    console.log("Company details submitted for new company with companyId:", companyId);
    // Directly complete the process with company details
    onComplete(data.companyName, 'Business Health Score', data.pitchDeckUrl, companyId);
  };

  const handleBack = () => {
    // No back functionality needed since we only have one step
  };

  return (
    <div className="space-y-6">
      <StepSelector step={step} onBack={handleBack} exerciseId={selectedExercise}>
        <CompanyDetailsForm onSubmit={onCompanyDetailsSubmit} />
      </StepSelector>
    </div>
  );
};

export default NewCompanyForm;
