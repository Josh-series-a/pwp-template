
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ExerciseSelector from './ExerciseSelector';
import ExerciseForm from './ExerciseForm';

interface NewCompanyFormProps {
  onComplete: (companyName: string, exerciseTitle: string) => void;
}

// Step 1: Company details validation schema
const companyDetailsSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  companyName: z.string().min(2, { message: "Company name is required" }),
  websiteUrl: z.string().url({ message: "Must be a valid URL starting with https://" })
    .refine(val => val.startsWith('https://'), { message: "URL must start with https://" })
});

type CompanyDetailsFormValues = z.infer<typeof companyDetailsSchema>;

const initialCompanyValues: CompanyDetailsFormValues = {
  fullName: '',
  companyName: '',
  websiteUrl: 'https://'
};

const NewCompanyForm: React.FC<NewCompanyFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetailsFormValues>(initialCompanyValues);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  
  // Company details form
  const companyForm = useForm<CompanyDetailsFormValues>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: initialCompanyValues
  });

  // Handle company details submission
  const onCompanyDetailsSubmit = (data: CompanyDetailsFormValues) => {
    setCompanyDetails(data);
    setStep(2);
  };

  // Handle exercise selection
  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setStep(3);
  };

  // Handle exercise form submission
  const handleExerciseComplete = (exerciseTitle: string) => {
    onComplete(companyDetails.companyName, exerciseTitle);
  };

  // Go back to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Company Details */}
      {step === 1 && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium">Step 1: Enter Company Details</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Please provide basic information about the company
            </p>
          </div>

          <Form {...companyForm}>
            <form onSubmit={companyForm.handleSubmit(onCompanyDetailsSubmit)} className="space-y-4">
              <FormField
                control={companyForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={companyForm.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={companyForm.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button type="submit">Continue to Exercise Selection</Button>
              </div>
            </form>
          </Form>
        </>
      )}

      {/* Step 2: Exercise Selection */}
      {step === 2 && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium">Step 2: Choose Exercise</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Select an exercise to complete
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
              Fill out the form for the selected exercise
            </p>
          </div>

          <ExerciseForm 
            exerciseId={selectedExercise}
            onBack={handleBack}
            onComplete={handleExerciseComplete}
          />
        </>
      )}
    </div>
  );
};

export default NewCompanyForm;
