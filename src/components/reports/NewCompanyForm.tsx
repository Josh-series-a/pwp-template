
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CompanyDetailsForm, { CompanyDetailsFormValues } from './forms/CompanyDetailsForm';
import StepSelector from './StepSelector';

interface NewCompanyFormProps {
  onComplete: (companyName: string, exerciseTitle: string, pitchDeckUrl?: string, companyId?: string) => Promise<string> | void;
  userData: any;
  onStepChange?: (step: number) => void;
}

const NewCompanyForm: React.FC<NewCompanyFormProps> = ({ onComplete, userData, onStepChange }) => {
  const step = 1; // Always step 1 since we only have one step
  const selectedExercise = 'business-health-score';
  const [companyId] = useState<string>(() => crypto.randomUUID());
  const { user } = useAuth();

  const onCompanyDetailsSubmit = async (data: CompanyDetailsFormValues, reportId?: string) => {
    console.log("Company details submitted for new company with companyId:", companyId, "reportId:", reportId);
    // Call onComplete and get the actual reportId from the created report
    const result = await onComplete(data.companyName, 'Business Health Score', data.pitchDeckUrl, companyId);
    // Return the actual reportId if available
    return typeof result === 'string' ? result : companyId;
  };

  const handleBack = () => {
    // No back functionality needed since we only have one step
  };

  return (
    <div className="space-y-6">
      <StepSelector step={step} onBack={handleBack} exerciseId={selectedExercise}>
        <CompanyDetailsForm onSubmit={onCompanyDetailsSubmit} onStepChange={onStepChange} />
      </StepSelector>
    </div>
  );
};

export default NewCompanyForm;
