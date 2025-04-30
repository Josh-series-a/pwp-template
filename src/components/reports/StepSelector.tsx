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
  return <div className="mb-6">
      
      
      {children}
      {step > 1 && <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>}
    </div>;
};
export default StepSelector;