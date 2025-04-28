
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ExerciseSelector from './ExerciseSelector';
import ExerciseForm from './ExerciseForm';
import CompanyDetailsForm, { CompanyDetailsFormValues } from './forms/CompanyDetailsForm';
import StepSelector from './StepSelector';

interface NewCompanyFormProps {
  onComplete: (companyName: string, exerciseTitle: string, pitchDeckUrl?: string) => void;
  userData: any;
}

const NewCompanyForm: React.FC<NewCompanyFormProps> = ({ onComplete, userData }) => {
  const [step, setStep] = useState<number>(1);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetailsFormValues | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const { user } = useAuth();

  const onCompanyDetailsSubmit = async (data: CompanyDetailsFormValues) => {
    setCompanyDetails(data);
    setStep(2);
  };

  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setStep(3);
  };

  const handleExerciseComplete = (exerciseTitle: string) => {
    if (companyDetails) {
      onComplete(companyDetails.companyName, exerciseTitle, companyDetails.pitchDeckUrl);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const companyId = `comp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return (
    <div className="space-y-6">
      <StepSelector step={step} onBack={handleBack} exerciseId={selectedExercise}>
        {step === 1 && (
          <CompanyDetailsForm onSubmit={onCompanyDetailsSubmit} />
        )}

        {step === 2 && (
          <ExerciseSelector onSelect={handleSelectExercise} />
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
