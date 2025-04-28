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
import { supabase } from '@/integrations/supabase/client';

interface NewCompanyFormProps {
  onComplete: (companyName: string, exerciseTitle: string, pitchDeckUrl?: string) => void;
  userData: any;
}

const companyDetailsSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  companyName: z.string().min(2, { message: "Company name is required" }),
  pitchDeck: z.instanceof(File)
    .refine((file) => {
      return file instanceof File && file.size <= 10 * 1024 * 1024; // 10MB
    }, "Pitch deck is required and file size should be less than 10MB")
    .refine((file) => {
      return file.type === 'application/pdf';
    }, "Only PDF files are allowed"),
  pitchDeckUrl: z.string().optional()
});

type CompanyDetailsFormValues = z.infer<typeof companyDetailsSchema>;

const initialCompanyValues: Partial<CompanyDetailsFormValues> = {
  fullName: '',
  companyName: '',
};

const NewCompanyForm: React.FC<NewCompanyFormProps> = ({ onComplete, userData }) => {
  const [step, setStep] = useState<number>(1);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetailsFormValues | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const companyForm = useForm<CompanyDetailsFormValues>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: initialCompanyValues as any
  });

  const handleFilesSelected = async (files: FileList) => {
    if (files.length === 0) return;
    
    const file = files[0];
    if (file.type !== 'application/pdf') {
      toast({
        title: "Error",
        description: "Only PDF files are allowed",
        variant: "destructive"
      });
      return;
    }

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
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('pitch-deck')
        .upload(fileName, file, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('pitch-deck')
        .getPublicUrl(fileName);

      companyForm.setValue('pitchDeck', file);
      companyForm.setValue('pitchDeckUrl', publicUrl);
      
      console.log("File uploaded successfully. Public URL:", publicUrl);
      
      toast({
        title: "Success",
        description: "Pitch deck uploaded successfully"
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: `Failed to upload pitch deck: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onCompanyDetailsSubmit = async (data: CompanyDetailsFormValues) => {
    if (!data.pitchDeckUrl) {
      toast({
        title: "Error",
        description: "Please upload a pitch deck PDF before continuing",
        variant: "destructive"
      });
      return;
    }
    
    setCompanyDetails({
      ...data,
      pitchDeckUrl: data.pitchDeckUrl
    });
    console.log('Company details saved for combined submission:', data);
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
      {step === 1 && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium">Step 1: Enter Company Details</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Please provide basic information about the company. All fields are required.
            </p>
          </div>

          <Form {...companyForm}>
            <form onSubmit={companyForm.handleSubmit(onCompanyDetailsSubmit)} className="space-y-4">
              <FormField
                control={companyForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} required />
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
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} required />
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
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Upload Pitch Deck
                    </FormLabel>
                    <FormDescription>
                      Drag and drop or click to upload your pitch deck (Required, Max 10MB, PDF format only)
                    </FormDescription>
                    <FormControl>
                      <DropZone
                        isUploading={isUploading}
                        onFilesSelected={handleFilesSelected}
                      />
                    </FormControl>
                    <FormMessage />
                    {companyForm.watch('pitchDeckUrl') && (
                      <div className="mt-2 text-sm text-green-600">
                        File uploaded successfully! ✓
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={!companyForm.watch('pitchDeckUrl') || isUploading}
                >
                  Continue to Exercise Selection
                </Button>
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

      {step === 3 && selectedExercise && companyDetails && (
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
