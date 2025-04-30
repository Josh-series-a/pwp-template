
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

interface FeedbackFormProps {
  onSuccess?: () => void;
}

const feedbackSchema = z.object({
  feedback: z.string()
    .min(10, { message: 'Feedback must be at least 10 characters.' })
    .max(1000, { message: 'Feedback cannot exceed 1000 characters.' }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const FeedbackForm = ({ onSuccess }: FeedbackFormProps) => {
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedback: '',
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      // In a real app, you would send this to your backend
      console.log('Feedback submitted:', data);
      
      // Show success message
      toast.success('Thank you for your feedback!');
      
      // Reset the form
      form.reset();
      
      // Close the dialog if onSuccess callback is provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Feedback</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your thoughts, suggestions, or report any issues..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Your feedback helps us improve the product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit">
            Submit Feedback
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FeedbackForm;
