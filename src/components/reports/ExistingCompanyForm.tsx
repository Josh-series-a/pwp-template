
import React, { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ExerciseSelector from './ExerciseSelector';
import ExerciseForm from './ExerciseForm';

interface ExistingCompanyFormProps {
  onComplete: (companyName: string, exerciseTitle: string) => void;
}

// Mock data for existing companies - this would come from an API in a real app
const mockCompanies = [
  { id: '1', name: 'Acme Corporation' },
  { id: '2', name: 'TechStart Inc.' },
  { id: '3', name: 'Global Solutions Ltd.' },
  { id: '4', name: 'InnoVentures' },
  { id: '5', name: 'Bright Future Holdings' }
];

const ExistingCompanyForm: React.FC<ExistingCompanyFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  
  // Handle company selection
  const handleSelectCompany = (companyId: string) => {
    setSelectedCompany(companyId);
    setStep(2);
  };

  // Handle exercise selection
  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setStep(3);
  };

  // Find company name based on ID
  const getCompanyName = () => {
    const company = mockCompanies.find(c => c.id === selectedCompany);
    return company ? company.name : 'Unknown Company';
  };

  // Create company details object for passing to ExerciseForm
  const getCompanyDetails = () => {
    const companyName = getCompanyName();
    return {
      companyName,
      fromExisting: true
    };
  };

  // Handle exercise form submission
  const handleExerciseComplete = (exerciseTitle: string) => {
    onComplete(getCompanyName(), exerciseTitle);
  };

  // Go back to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Select Existing Company */}
      {step === 1 && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium">Step 1: Select Existing Company</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a company you've previously entered
            </p>
          </div>

          <Select onValueChange={handleSelectCompany}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {mockCompanies.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="pt-4">
            <Button 
              onClick={() => selectedCompany && setStep(2)} 
              disabled={!selectedCompany}
            >
              Continue to Exercise Selection
            </Button>
          </div>
        </>
      )}

      {/* Step 2: Exercise Selection */}
      {step === 2 && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium">Step 2: Choose Exercise</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select an exercise to complete for {getCompanyName()}
            </p>
          </div>

          <ExerciseSelector onSelect={handleSelectExercise} />

          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          </div>
        </>
      )}

      {/* Step 3: Exercise Form */}
      {step === 3 && selectedExercise && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium">Step 3: Complete Exercise</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Fill out the form for {getCompanyName()}
            </p>
          </div>

          <ExerciseForm 
            exerciseId={selectedExercise}
            onBack={handleBack}
            onComplete={handleExerciseComplete}
            companyDetails={getCompanyDetails()} // Pass company details to the ExerciseForm
          />
        </>
      )}
    </div>
  );
};

export default ExistingCompanyForm;
