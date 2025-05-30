
import React, { useState, useEffect } from 'react';
import BusinessHealthScoreForm from './forms/BusinessHealthScoreForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ExerciseFormProps {
  exerciseId: string;
  onBack: () => void;
  onComplete: (exerciseTitle: string) => void;
  companyDetails?: any;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  exerciseId,
  onBack,
  onComplete,
  companyDetails
}) => {
  const [reportId, setReportId] = useState<string | null>(null);
  const [isCreatingReport, setIsCreatingReport] = useState(true);
  const { toast } = useToast();

  // Create report when component mounts
  useEffect(() => {
    const createReport = async () => {
      if (!companyDetails) {
        console.error('Company details are required to create a report');
        toast({
          title: "Error",
          description: "Company details are missing. Please go back and complete the previous steps.",
          variant: "destructive",
        });
        return;
      }

      try {
        console.log('Creating report with company details:', companyDetails);
        
        const reportData = {
          title: `Business Health Assessment - ${companyDetails.companyName}`,
          company_name: companyDetails.companyName,
          exercise_id: exerciseId,
          status: 'In Progress',
          user_id: companyDetails.userData?.id || companyDetails.companyId,
          company_id: companyDetails.companyId,
          pitch_deck_url: companyDetails.pitchDeckUrl || null
        };

        console.log('Report data to insert:', reportData);

        const { data, error } = await supabase
          .from('reports')
          .insert([reportData])
          .select()
          .single();

        if (error) {
          throw error;
        }

        console.log('Report created successfully:', data);
        setReportId(data.id);
        setIsCreatingReport(false);
      } catch (error) {
        console.error('Error creating report:', error);
        toast({
          title: "Error creating report",
          description: "Failed to create report. Please try again.",
          variant: "destructive",
        });
        setIsCreatingReport(false);
      }
    };

    createReport();
  }, [companyDetails, exerciseId, toast]);

  const handleFormComplete = () => {
    onComplete('Business Health Score Assessment');
  };

  if (isCreatingReport) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Creating your report...</p>
        </div>
      </div>
    );
  }

  if (!reportId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600">Failed to create report. Please try again.</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-gray-200 rounded">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render the appropriate form based on exerciseId
  if (exerciseId === 'business-health-score') {
    return (
      <BusinessHealthScoreForm
        exerciseId={exerciseId}
        onBack={onBack}
        onComplete={handleFormComplete}
        companyDetails={companyDetails}
        reportId={reportId}
      />
    );
  }

  // Default fallback
  return (
    <div className="p-8 text-center">
      <p>Exercise form for "{exerciseId}" is not yet implemented.</p>
      <button onClick={onBack} className="mt-4 px-4 py-2 bg-gray-200 rounded">
        Go Back
      </button>
    </div>
  );
};

export default ExerciseForm;
