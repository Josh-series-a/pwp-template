
import React from 'react';
import { Button } from '@/components/ui/button';

interface StepSelectorProps {
  step: number;
  onBack: () => void;
  exerciseId?: string | null;
  children: React.ReactNode;
}

const StepSelector: React.FC<StepSelectorProps> = ({ 
  step, 
  onBack, 
  exerciseId,
  children 
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium">
        {step === 1 && "Step 1: Enter Company Details"}
        {step === 2 && "Step 2: Choose Exercise"}
        {step === 3 && "Step 3: Complete Exercise"}
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        {step === 1 && "Please provide basic information about the company"}
        {step === 2 && "Select an exercise to complete"}
        {step === 3 && "Fill out the form for the selected exercise"}
      </p>
      {children}
      {step > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepSelector;
