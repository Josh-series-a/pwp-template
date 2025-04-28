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
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ExerciseSelector from './ExerciseSelector';
import ExerciseForm from './ExerciseForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DropZone from '../upload/DropZone';

interface NewCompanyFormProps {
  onComplete: (companyName: string, exerciseTitle: string) => void;
  userData: any;
}

const companyDetailsSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  companyName: z.string().min(2, { message: "Company name is required" }),
  pitchDeck: z.any()
    .refine((file) => {
      if (!file) return true; // Allow empty
      return file instanceof File && file.size <= 10 * 1024 * 1024; // 10MB
    }, "File size should be less than 10MB")
});

type CompanyDetailsFormValues = z.infer<typeof companyDetailsSchema>;

const initialCompanyValues: CompanyDetailsFormValues = {
  fullName: '',
  companyName: '',
  pitchDeck: ''
};

const NewCompanyForm: React.FC<NewCompanyFormProps> = ({ onComplete, userData }) => {
  const [step, setStep] = useState<number>(1);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetailsFormValues>(initialCompanyValues);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const companyForm = useForm<CompanyDetailsFormValues>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: initialCompanyValues
  });

  const handleFilesSelected = async (files: FileList) => {
    if (files.length === 0) return;
    
    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size should be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      companyForm.setValue('pitchDeck', file);
      toast({
        title: "Success",
        description: "Pitch deck uploaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload pitch deck",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onCompanyDetailsSubmit = async (data: CompanyDetailsFormValues) => {
    setCompanyDetails(data);
    console.log('Company details saved for combined submission:', data);
    setStep(2);
  };

  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setStep(3);
  };

  const handleExerciseComplete = (exerciseTitle: string) => {
    onComplete(companyDetails.companyName, exerciseTitle);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const companyId = `comp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return (
    <div className="space-y-6">
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
                name="pitchDeck"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Upload Pitch Deck</FormLabel>
                    <FormDescription>
                      Drag and drop or click to upload your pitch deck (Max 10MB, PDF format recommended)
                    </FormDescription>
                    <FormControl>
                      <DropZone
                        isUploading={isUploading}
                        onFilesSelected={handleFilesSelected}
                      />
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
            companyDetails={{
              ...companyDetails,
              companyId: companyId,
              userData: {
                name: userData?.user_metadata?.name || companyDetails.fullName,
                email: userData?.email || 'unknown@example.com'
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default NewCompanyForm;
