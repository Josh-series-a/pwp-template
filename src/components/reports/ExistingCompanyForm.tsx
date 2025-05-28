import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ExerciseSelector from './ExerciseSelector';
import ExerciseForm from './ExerciseForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
interface ExistingCompanyFormProps {
  onComplete: (companyName: string, exerciseTitle: string) => void;
  userData: any | null;
}
interface Company {
  id: string;
  name: string;
}
const ExistingCompanyForm: React.FC<ExistingCompanyFormProps> = ({
  onComplete,
  userData
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    toast
  } = useToast();

  // Fetch existing companies from reports table
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        // Get unique company names from reports table
        const {
          data,
          error
        } = await supabase.from('reports').select('company_name').order('company_name');
        if (error) {
          throw error;
        }
        if (data) {
          // Create unique list of companies
          const uniqueCompanies = Array.from(new Set(data.map(item => item.company_name))).map((name, index) => ({
            id: `comp-${index}`,
            name: name as string
          }));
          setCompanies(uniqueCompanies);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast({
          title: "Error",
          description: "Failed to load companies. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [toast]);

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
    const company = companies.find(c => c.id === selectedCompany);
    return company ? company.name : 'Unknown Company';
  };

  // Generate a unique company ID
  const companyId = `comp-${selectedCompany}-${Date.now()}`;

  // Create company details object for passing to ExerciseForm
  const getCompanyDetails = () => {
    const companyName = getCompanyName();
    return {
      companyName,
      fromExisting: true,
      companyId: companyId,
      userData: {
        name: userData?.user_metadata?.name || 'Unknown User',
        email: userData?.email || 'unknown@example.com'
      }
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
  return <div className="space-y-6">
      {/* Step 1: Select Existing Company */}
      {step === 1 && <>
          <div className="mb-6">
            <h3 className="text-lg font-medium">Step 1: Select Existing Company</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a company you've previously entered
            </p>
          </div>

          <Select onValueChange={handleSelectCompany}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loading ? "Loading companies..." : "Select a company"} />
            </SelectTrigger>
            <SelectContent>
              {companies.map(company => <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>)}
              {companies.length === 0 && !loading && <SelectItem value="none" disabled>
                  No companies found
                </SelectItem>}
            </SelectContent>
          </Select>

          <div className="pt-4">
            <Button onClick={() => selectedCompany && setStep(2)} disabled={!selectedCompany}>Continue to Discovery Questions Selection</Button>
          </div>
        </>}

      {/* Step 2: Exercise Selection */}
      {step === 2 && <>
          <div className="mb-6">
            <h3 className="text-lg font-medium">Step 2: Choose Discovery Questions</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select an exercise to complete for {getCompanyName()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This will help tailor the insights, language, and recommendations in each document so that the final output is more relevant, actionable, and aligned with your Business's real needs.
            </p>
          </div>

          <ExerciseSelector onSelect={handleSelectExercise} />

          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          </div>
        </>}

      {/* Step 3: Exercise Form */}
      {step === 3 && selectedExercise && <>
          <div className="mb-6">
            <h3 className="text-lg font-medium">Step 3: Complete Exercise</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Fill out the form for {getCompanyName()}
            </p>
          </div>

          <ExerciseForm exerciseId={selectedExercise} onBack={handleBack} onComplete={handleExerciseComplete} companyDetails={getCompanyDetails()} // Pass company details to the ExerciseForm
      />
        </>}
    </div>;
};
export default ExistingCompanyForm;
