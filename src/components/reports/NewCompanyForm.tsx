
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ExerciseSelector from './ExerciseSelector';
import ExerciseForm from './ExerciseForm';
import CompanyDetailsForm, { CompanyDetailsFormValues } from './forms/CompanyDetailsForm';
import StepSelector from './StepSelector';

interface NewCompanyFormProps {
  onComplete: (companyName: string, exerciseTitle: string, pitchDeckUrl?: string, companyId?: string) => void;
  userData: any;
}

const NewCompanyForm: React.FC<NewCompanyFormProps> = ({ onComplete, userData }) => {
  const [step, setStep] = useState<number>(1);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetailsFormValues | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  // Generate UUID once when component mounts for this new company
  const [companyId] = useState<string>(() => crypto.randomUUID());
  const { user } = useAuth();

  const onCompanyDetailsSubmit = async (data: CompanyDetailsFormValues) => {
    console.log("Company details submitted for new company with companyId:", companyId);
    setCompanyDetails(data);
    setStep(2);
  };

  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setStep(3);
  };

  const handleExerciseComplete = (exerciseTitle: string) => {
    if (companyDetails) {
      console.log("Completing new company exercise with companyId:", companyId);
      onComplete(companyDetails.companyName, exerciseTitle, companyDetails.pitchDeckUrl, companyId);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="space-y-6">
      <StepSelector step={step} onBack={handleBack} exerciseId={selectedExercise}>
        {step === 1 && (
          <CompanyDetailsForm onSubmit={onCompanyDetailsSubmit} />
        )}

        {step === 2 && (
          <ExerciseSelector onSelect={handleSelectExercise} isNewCompany={true} />
        )}

        {step === 3 && selectedExercise && companyDetails && (
          <ExerciseForm 
            exerciseId={selectedExercise}
            onBack={handleBack}
            onComplete={handleExerciseComplete}
            companyDetails={{
              ...companyDetails,
              companyId: companyId,
              userData: {
                name: userData?.user_metadata?.name || companyDetails.fullName,
                email: userData?.email || 'unknown@example.com'
              }
            }}
          />
        )}
      </StepSelector>
    </div>
  );
};

export default NewCompanyForm;
