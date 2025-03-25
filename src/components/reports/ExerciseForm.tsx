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
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ExerciseFormProps {
  exerciseId: string;
  onBack: () => void;
  onComplete: (exerciseTitle: string) => void;
  companyDetails?: any;
}

interface ExerciseFormComponentProps {
  exerciseId: string;
  onBack: () => void;
  onComplete: () => void;
  companyDetails?: any;
}

const exitStrategySchema = z.object({
  hasStrategy: z.enum(['yes', 'no'], {
    required_error: "Please select an option",
  }),
  exitDate: z.date().optional(),
  exitDateText: z.string().optional(),
  hasPlan: z.string().min(1, { message: "Please provide details about your plan" }),
  implementationSteps: z.string().min(1, { message: "Please outline your implementation steps" }),
  resources: z.string().min(1, { message: "Please describe the resources allocated" })
});

const customerSchema = z.object({
  personaDescription: z.string().min(1, { message: "Please provide a description" }),
  age: z.string().min(1, { message: "Age is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  personalSituation: z.string().min(1, { message: "Personal situation is required" }),
  jobTitle: z.string().min(1, { message: "Job title is required" }),
  spareTime: z.string().min(1, { message: "Please describe how they spend spare time" }),
  disposableIncome: z.string().min(1, { message: "Income/budget is required" }),
  challenges: z.string().min(1, { message: "Please describe their challenges" }),
  goals: z.string().min(1, { message: "Please describe their goals" }),
  idealCustomerReason: z.string().min(1, { message: "Please explain why this is your ideal customer" }),
  offerRequirements: z.string().min(1, { message: "Please describe what you must offer" })
});

const propositionSchema = z.object({
  primaryValue: z.enum(['price', 'quality', 'delivery', 'flexibility', 'service'], {
    required_error: "Please select a primary value",
  }),
  plusOneValue: z.enum(['price', 'quality', 'delivery', 'flexibility', 'service'], {
    required_error: "Please select a +1 value",
  }),
  explanation: z.string().min(1, { message: "Please explain your choice" })
});

const delegationSchema = z.object({
  knowStaff: z.enum(['a', 'b', 'c'], { required_error: "Please select an option" }),
  staffKnowYou: z.enum(['a', 'b', 'c'], { required_error: "Please select an option" }),
  reportCount: z.enum(['a', 'b', 'c'], { required_error: "Please select an option" }),
  meetingFrequency: z.enum(['a', 'b', 'c'], { required_error: "Please select an option" }),
  monitoringProcess: z.enum(['a', 'b', 'c'], { required_error: "Please select an option" }),
  writtenProcesses: z.enum(['a', 'b', 'c'], { required_error: "Please select an option" }),
  teamTraining: z.enum(['a', 'b', 'c'], { required_error: "Please select an option" })
});

const keyCustomersSchema = z.object({
  customerList: z.string().min(1, { message: "Please list your key customers" }),
  customerKnowledge: z.string().min(1, { message: "Please rate your knowledge of customers" }),
  improvementIdeas: z.string().min(1, { message: "Please suggest improvements" }),
  relationshipImprovements: z.string().min(1, { message: "Please describe relationship improvements" })
});

const getExerciseTitle = (exerciseId: string): string => {
  switch (exerciseId) {
    case 'exercise-4': return 'Exercise 4: Define Your Exit Strategy';
    case 'exercise-6': return 'Exercise 6: Know Your Customer';
    case 'exercise-7': return 'Exercise 7: Create Your "1+1" Proposition';
    case 'exercise-18': return 'Exercise 18: Measure Your Delegation';
    case 'exercise-27': return 'Exercise 27: Know Your Key Customers';
    default: return '';
  }
};

const getExerciseNumber = (exerciseId: string): string => {
  const match = exerciseId.match(/exercise-(\d+)/);
  return match ? match[1] : '';
};

const WEBHOOK_URL = "https://hook.eu2.make.com/dioppcyf0ife7k5jcxfegfkoi9dir29n";

const ExerciseForm: React.FC<ExerciseFormProps> = ({ exerciseId, onBack, onComplete, companyDetails }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const exerciseTitle = getExerciseTitle(exerciseId);
  const { toast } = useToast();
  const { user } = useAuth();

  const renderForm = () => {
    switch (exerciseId) {
      case 'exercise-4':
        return <ExitStrategyForm exerciseId={exerciseId} onBack={onBack} onComplete={() => onComplete(exerciseTitle)} companyDetails={companyDetails} />;
      case 'exercise-6':
        return <CustomerForm exerciseId={exerciseId} onBack={onBack} onComplete={() => onComplete(exerciseTitle)} companyDetails={companyDetails} />;
      case 'exercise-7':
        return <PropositionForm exerciseId={exerciseId} onBack={onBack} onComplete={() => onComplete(exerciseTitle)} companyDetails={companyDetails} />;
      case 'exercise-18':
        return <DelegationForm exerciseId={exerciseId} onBack={onBack} onComplete={() => onComplete(exerciseTitle)} companyDetails={companyDetails} />;
      case 'exercise-27':
        return <KeyCustomersForm exerciseId={exerciseId} onBack={onBack} onComplete={() => onComplete(exerciseTitle)} companyDetails={companyDetails} />;
      default:
        return <div>Unknown exercise</div>;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">{exerciseTitle}</h3>
      {renderForm()}
    </div>
  );
};

const sendToWebhook = async (data: any, exerciseType: string, userId: string | undefined, exerciseId: string, companyDetails?: any) => {
  try {
    const exerciseNumber = getExerciseNumber(exerciseId);
    
    const exercisePayload = {
      ...data,
      exerciseType,
      exerciseNumber,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString()
    };
    
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exercisePayload),
      mode: 'no-cors',
    });
    
    console.log('Exercise webhook sent:', exercisePayload);
    
    if (companyDetails) {
      const companyPayload = {
        ...companyDetails,
        formType: 'Company Details',
        exerciseNumber,
        userId: userId || 'anonymous',
        timestamp: new Date().toISOString()
      };
      
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyPayload),
        mode: 'no-cors',
      });
      
      console.log('Company details webhook sent:', companyPayload);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending to webhook:', error);
    return false;
  }
};

const ExitStrategyForm: React.FC<ExerciseFormComponentProps> = ({ exerciseId, onBack, onComplete, companyDetails }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof exitStrategySchema>>({
    resolver: zodResolver(exitStrategySchema),
    defaultValues: {
      hasStrategy: undefined,
      exitDateText: '',
      hasPlan: '',
      implementationSteps: '',
      resources: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof exitStrategySchema>) => {
    setIsSubmitting(true);
    console.log(data);
    
    try {
      await sendToWebhook(data, 'Exit Strategy', user?.id, exerciseId, companyDetails);
      
      onComplete();
      toast({
        title: "Form submitted successfully",
        description: "Your exit strategy analysis has been started.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission error",
        description: "The form was processed but there was an error with the webhook submission.",
        variant: "destructive",
      });
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="hasStrategy"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Do you have an exit strategy?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="exitDateText"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>When would you like to exit?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., In 5 years, 2028, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exitDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Or select specific date (optional)</FormLabel>
                  <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setShowDatePicker(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="hasPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you have a plan for making the exit strategy happen in that timeframe?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your plan..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="implementationSteps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What steps have you put in place to make the plan happen?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List your implementation steps..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resources"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How much time and resources have you allocated to making this strategy happen?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe allocated resources..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const CustomerForm: React.FC<ExerciseFormComponentProps> = ({ exerciseId, onBack, onComplete, companyDetails }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      personaDescription: '',
      age: '',
      gender: '',
      location: '',
      personalSituation: '',
      jobTitle: '',
      spareTime: '',
      disposableIncome: '',
      challenges: '',
      goals: '',
      idealCustomerReason: '',
      offerRequirements: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof customerSchema>) => {
    setIsSubmitting(true);
    console.log(data);
    
    try {
      await sendToWebhook(data, 'Know Your Customer', user?.id, exerciseId, companyDetails);
      
      onComplete();
      toast({
        title: "Form submitted successfully",
        description: "Your customer analysis has been started.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission error",
        description: "The form was processed but there was an error with the webhook submission.",
        variant: "destructive",
      });
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="personaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short description of customer persona</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your ideal customer..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 25-34" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Male, Female, Non-binary" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where do they live?</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Urban area, New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="personalSituation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal situation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Married with kids" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Marketing Director" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="disposableIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disposable income or project budget</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., $5,000-$10,000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="spareTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How do they spend their spare time?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe their hobbies and interests..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="challenges"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Concerns/challenges/fears</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List their main challenges..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Big goals (work and personal)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe their main goals..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idealCustomerReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why is this your ideal customer?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain why they're ideal for your business..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="offerRequirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What must you offer to attract them?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your offering strategy..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const PropositionForm: React.FC<ExerciseFormComponentProps> = ({ exerciseId, onBack, onComplete, companyDetails }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof propositionSchema>>({
    resolver: zodResolver(propositionSchema),
    defaultValues: {
      primaryValue: undefined,
      plusOneValue: undefined,
      explanation: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof propositionSchema>) => {
    setIsSubmitting(true);
    console.log(data);
    
    try {
      await sendToWebhook(data, 'Create Your 1+1 Proposition', user?.id, exerciseId, companyDetails);
      
      onComplete();
      toast({
        title: "Form submitted successfully",
        description: "Your proposition analysis has been started.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission error",
        description: "The form was processed but there was an error with the webhook submission.",
        variant: "destructive",
      });
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="primaryValue"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Choose your primary value</FormLabel>
              <FormDescription>
                Select the most important value your business offers
              </FormDescription>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {['price', 'quality', 'delivery', 'flexibility', 'service'].map((value) => (
                    <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={value} />
                      </FormControl>
                      <FormLabel className="font-normal capitalize">{value}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plusOneValue"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Choose your '+1' value</FormLabel>
              <FormDescription>
                Select your secondary value proposition
              </FormDescription>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {['price', 'quality', 'delivery', 'flexibility', 'service'].map((value) => (
                    <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={value} />
                      </FormControl>
                      <FormLabel className="font-normal capitalize">{value}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>In your words, explain why you chose this combination</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain your choice..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const DelegationForm: React.FC<ExerciseFormComponentProps> = ({ exerciseId, onBack, onComplete, companyDetails }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof delegationSchema>>({
    resolver: zodResolver(delegationSchema),
    defaultValues: {
      knowStaff: undefined,
      staffKnowYou: undefined,
      reportCount: undefined,
      meetingFrequency: undefined,
      monitoringProcess: undefined,
      writtenProcesses: undefined,
      teamTraining: undefined
    }
  });

  const options = [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
    { label: 'C', value: 'c' }
  ];

  const questions = [
    { name: 'knowStaff', label: 'How well do you know your senior staff?' },
    { name: 'staffKnowYou', label: 'How well do they know you?' },
    { name: 'reportCount', label: 'How many people report to you?' },
    { name: 'meetingFrequency', label: 'How often do you meet them (for longer than 45 minutes)?' },
    { name: 'monitoringProcess', label: 'Do you have a process for monitoring them?' },
    { name: 'writtenProcesses', label: 'Are your processes written down?' },
    { name: 'teamTraining', label: 'Do you train your team?' }
  ];

  const onSubmit = async (data: z.infer<typeof delegationSchema>) => {
    setIsSubmitting(true);
    console.log(data);
    
    try {
      await sendToWebhook(data, 'Measure Your Delegation', user?.id, exerciseId, companyDetails);
      
      onComplete();
      toast({
        title: "Form submitted successfully",
        description: "Your delegation analysis has been started.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission error",
        description: "The form was processed but there was an error with the webhook submission.",
        variant: "destructive",
      });
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {questions.map((question) => (
          <FormField
            key={question.name}
            control={form.control}
            name={question.name as keyof z.infer<typeof delegationSchema>}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    {options.map((option) => (
                      <FormItem key={option.value} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={option.value} />
                        </FormControl>
                        <FormLabel className="font-normal">{option.label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const KeyCustomersForm: React.FC<ExerciseFormComponentProps> = ({ exerciseId, onBack, onComplete, companyDetails }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof keyCustomersSchema>>({
    resolver: zodResolver(keyCustomersSchema),
    defaultValues: {
      customerList: '',
      customerKnowledge: '',
      improvementIdeas: '',
      relationshipImprovements: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof keyCustomersSchema>) => {
    setIsSubmitting(true);
    console.log(data);
    
    try {
      await sendToWebhook(data, 'Know Your Key Customers', user?.id, exerciseId, companyDetails);
      
      onComplete();
      toast({
        title: "Form submitted successfully",
        description: "Your key customers analysis has been started.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission error",
        description: "The form was processed but there was an error with the webhook submission.",
        variant: "destructive",
      });
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customerList"
          render={({ field }) => (
            <FormItem>
              <FormLabel>List your main/key customers</FormLabel>
              <FormDescription>
                Enter one customer per line or separate with commas
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="e.g., Acme Inc., TechCorp, Global Solutions..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerKnowledge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How well do you know these customers?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Rate your knowledge and understanding..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="improvementIdeas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What would you like to improve or change?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List your improvement ideas..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relationshipImprovements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How will you improve your relationship with these customers?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your strategy for improvement..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExerciseForm;
