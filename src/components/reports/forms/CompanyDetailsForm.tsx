
import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ArrowRight, Building2, Upload, CheckCircle } from 'lucide-react';
import DropZone from '../../upload/DropZone';
import { supabase } from '@/integrations/supabase/client';

export const companyDetailsSchema = z.object({
  companyName: z.string().min(2, { message: "Company name is required" }),
  pitchDeck: z.instanceof(File)
    .refine((file) => {
      return file instanceof File && file.size <= 10 * 1024 * 1024;
    }, "Pitch deck is required and file size should be less than 10MB")
    .refine((file) => {
      return file.type === 'application/pdf';
    }, "Only PDF files are allowed"),
  pitchDeckUrl: z.string().optional()
});

export type CompanyDetailsFormValues = z.infer<typeof companyDetailsSchema>;

interface CompanyDetailsFormProps {
  onSubmit: (data: CompanyDetailsFormValues, reportId?: string) => Promise<string | void> | string | void;
  onStepChange?: (step: number) => void;
  reportId?: string; // Add reportId prop to get the actual report ID
}

const initialCompanyValues: Partial<CompanyDetailsFormValues> = {
  companyName: '',
};

const pages = [
  { 
    title: 'Company Information', 
    icon: Building2, 
    description: 'Basic company details'
  },
  { 
    title: 'Document Upload', 
    icon: Upload, 
    description: 'Upload your pitch deck'
  }
];

const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance & Banking",
  "Manufacturing",
  "Retail & E-commerce",
  "Education",
  "Real Estate",
  "Construction",
  "Consulting",
  "Marketing & Advertising",
  "Transportation",
  "Energy & Utilities",
  "Food & Beverage",
  "Entertainment & Media",
  "Non-profit",
  "Government",
  "Other"
];

const companySizeOptions = [
  "1-10 employees",
  "11-50 employees", 
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees"
];

const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({ onSubmit, onStepChange, reportId: passedReportId }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  const form = useForm<CompanyDetailsFormValues>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: initialCompanyValues as any
  });

  // Update parent step when currentPage changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentPage + 1); // Convert 0-based to 1-based
    }
  }, [currentPage, onStepChange]);

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

      form.setValue('pitchDeck', file);
      form.setValue('pitchDeckUrl', publicUrl);
      
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

  const handleCompleteSetup = async (data: CompanyDetailsFormValues) => {
    setIsSubmitting(true);
    try {
      // First, call the original onSubmit to create the report and get the reportId
      const result = await onSubmit(data, passedReportId);
      const reportId = typeof result === 'string' ? result : passedReportId;

      // Then submit the Business Health Score data with the actual reportId
      if (reportId) {
        await submitBusinessHealthScore(data, reportId);
      } else {
        throw new Error("No report ID available for submission");
      }
      
      toast({
        title: "Business Health Score submitted successfully",
        description: "Your business health assessment has been completed.",
      });
    } catch (error) {
      console.error("Error submitting Business Health Score:", error);
      toast({
        title: "Submission error", 
        description: "There was an error submitting your business health assessment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitBusinessHealthScore = async (data: CompanyDetailsFormValues, reportId?: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (!reportId) {
      throw new Error("Report ID is required for Business Health Score submission");
    }

    // Create a basic business health score payload with company information
    const payload = {
      companyName: data.companyName,
      contactName: user.user_metadata?.name || 'Unknown Contact',
      fromExisting: false,
      reportId: reportId, // Use the actual reportId from the database
      originalCompanyId: null,
      companyType: 'New',
      exerciseId: 'business-health-score',
      exerciseTitle: 'Business Health Score',
      rawData: {
        companyName: data.companyName,
        documentName: data.pitchDeckUrl ? data.pitchDeckUrl.split('/').pop() : null
      },
      responses: `Company: ${data.companyName}\nPitch Deck: ${data.pitchDeckUrl ? 'Uploaded' : 'Not provided'}`,
      userId: user.id,
      userEmail: user.email || 'unknown@example.com',
      businessDocUrl: data.pitchDeckUrl || null,
      submittedAt: new Date().toISOString()
    };

    console.log('Submitting Business Health Score via edge function:', payload);

    // Submit to Supabase edge function
    const { data: result, error: submitError } = await supabase.functions.invoke('business-health-submission', {
      body: payload,
    });

    if (submitError) {
      console.error('Supabase function error:', submitError);
      throw new Error(`Submission failed: ${submitError.message}`);
    }

    if (!result?.success) {
      console.error('Business Health Submission failed:', result);
      throw new Error(`Submission failed: ${result?.error || 'Unknown error'}`);
    }

    console.log('Business Health Score submitted successfully:', result);
    return result;
  };

  const nextPage = async () => {
    const isValid = await form.trigger(getFieldsForPage(currentPage));
    if (isValid && currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getFieldsForPage = (page: number): (keyof CompanyDetailsFormValues)[] => {
    switch (page) {
      case 0: return ['companyName'];
      case 1: return ['pitchDeck'];
      default: return [];
    }
  };

  const isPageComplete = (page: number): boolean => {
    const fields = getFieldsForPage(page);
    const values = form.getValues();
    return fields.every(field => {
      const value = values[field];
      return value && String(value).trim() !== '';
    });
  };

  const currentPageData = pages[currentPage];
  const IconComponent = currentPageData.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{currentPageData.title}</h3>
            <p className="text-sm text-muted-foreground">{currentPageData.description}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Step {currentPage + 1} of {pages.length}</span>
            <span>{Math.round(((currentPage + 1) / pages.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
            />
          </div>
        </div>

      </div>

      {/* Form Content */}
      <Form {...form}>
        <div className="max-w-md mx-auto space-y-6">
          {/* Page 1: Company Information */}
          {currentPage === 0 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Page 2: Document Upload */}
          {currentPage === 1 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
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
                    {form.watch('pitchDeckUrl') && (
                      <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        File uploaded successfully!
                      </div>
                    )}
                    <div className="mt-2 text-sm text-muted-foreground">
                      Don't have pitch deck yet?{' '}
                      <a 
                        href="/contact" 
                        className="text-primary hover:text-primary/80 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Book Discovery Meeting
                      </a>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentPage < pages.length - 1 ? (
              <Button
                type="button"
                onClick={nextPage}
                disabled={!isPageComplete(currentPage)}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => form.handleSubmit(handleCompleteSetup)()}
                disabled={!form.watch('pitchDeckUrl') || isUploading || isSubmitting}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CompanyDetailsForm;
