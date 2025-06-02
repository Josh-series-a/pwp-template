
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
import { useToast } from '@/hooks/use-toast';
import DropZone from '../../upload/DropZone';
import { supabase } from '@/integrations/supabase/client';

export const companyDetailsSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
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
  onSubmit: (data: CompanyDetailsFormValues) => void;
}

const initialCompanyValues: Partial<CompanyDetailsFormValues> = {
  fullName: '',
  companyName: '',
};

const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<CompanyDetailsFormValues>({
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

  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-medium">Step 1: Enter Company Details</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Please provide basic information about the company. All fields are required.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
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
            control={form.control}
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
                  <div className="mt-2 text-sm text-green-600">
                    File uploaded successfully! ✓
                  </div>
                )}
                <div className="mt-2 text-sm text-muted-foreground">
                  Don't have pitch deck yet?{' '}
                  <a 
                    href="/contact" 
                    className="text-blue-600 hover:text-blue-800 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book Discovery Meeting
                  </a>
                </div>
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={!form.watch('pitchDeckUrl') || isUploading}
            >
              Continue to Exercise Selection
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default CompanyDetailsForm;
