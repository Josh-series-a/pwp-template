
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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const businessHealthScoreSchema = z.object({
  // STRESS & LEADERSHIP
  hoursInVsOn: z.string().min(1, { message: "Please select a rating" }),
  businessWithoutYou: z.enum(['yes', 'no'], { required_error: "Please select an option" }),
  stressManagement: z.enum(['A', 'B', 'C', 'D'], { required_error: "Please select an approach" }),
  valuesAlignment: z.string().min(1, { message: "Please select a rating" }),
  lastWeekendOff: z.string().min(1, { message: "Please describe your last weekend off" }),
  
  // PLAN
  missionWritten: z.enum(['yes', 'no'], { required_error: "Please select an option" }),
  scheduleAlignment: z.string().min(1, { message: "Please select a rating" }),
  exitStrategy: z.enum(['A', 'B', 'C', 'D', 'E'], { required_error: "Please select your exit strategy" }),
  futureBackThinking: z.enum(['yes', 'no'], { required_error: "Please select an option" }),
  nonNegotiables: z.string().min(1, { message: "Please list your top three non-negotiables" }),
  
  // PEOPLE
  businessWithout30Days: z.enum(['A', 'B', 'C', 'D'], { required_error: "Please select an option" }),
  delegationAccountability: z.enum(['yes', 'no'], { required_error: "Please select an option" }),
  rightPeopleConfidence: z.string().min(1, { message: "Please select a rating" }),
  teamDevelopmentTime: z.string().min(1, { message: "Please select a rating" }),
  retentionSystems: z.string().min(1, { message: "Please describe your retention systems" }),
  
  // PROFITS
  grossProfitMargin: z.enum(['yes', 'no'], { required_error: "Please select an option" }),
  cashFlowProcess: z.enum(['A', 'B', 'C', 'D'], { required_error: "Please select your cash flow process" }),
  pricingValue: z.string().min(1, { message: "Please select a rating" }),
  invoiceFollowUp: z.enum(['yes', 'no'], { required_error: "Please select an option" }),
  debtorCreditorTrends: z.string().min(1, { message: "Please describe the trends and your plan" }),
  
  // PURPOSE & IMPACT
  trackingItems: z.array(z.string()).min(1, { message: "Please select at least one item or None" }),
  purposeInfluencesBuying: z.enum(['yes', 'no'], { required_error: "Please select an option" }),
  purposeCommercialValue: z.string().min(1, { message: "Please select a rating" }),
  staffEmpowerment: z.string().min(1, { message: "Please describe how you empower staff" }),
  netZeroCommitment: z.enum(['yes', 'no'], { required_error: "Please select an option" })
});

interface BusinessHealthScoreFormProps {
  exerciseId: string;
  onBack: () => void;
  onComplete: () => void;
  companyDetails?: any;
}

const BusinessHealthScoreForm: React.FC<BusinessHealthScoreFormProps> = ({ 
  exerciseId, 
  onBack, 
  onComplete, 
  companyDetails 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof businessHealthScoreSchema>>({
    resolver: zodResolver(businessHealthScoreSchema),
    defaultValues: {
      hoursInVsOn: '',
      businessWithoutYou: undefined,
      stressManagement: undefined,
      valuesAlignment: '',
      lastWeekendOff: '',
      missionWritten: undefined,
      scheduleAlignment: '',
      exitStrategy: undefined,
      futureBackThinking: undefined,
      nonNegotiables: '',
      businessWithout30Days: undefined,
      delegationAccountability: undefined,
      rightPeopleConfidence: '',
      teamDevelopmentTime: '',
      retentionSystems: '',
      grossProfitMargin: undefined,
      cashFlowProcess: undefined,
      pricingValue: '',
      invoiceFollowUp: undefined,
      debtorCreditorTrends: '',
      trackingItems: [],
      purposeInfluencesBuying: undefined,
      purposeCommercialValue: '',
      staffEmpowerment: '',
      netZeroCommitment: undefined
    }
  });

  const autoFillForm = () => {
    const sampleData = {
      hoursInVsOn: '3',
      businessWithoutYou: 'no' as const,
      stressManagement: 'C' as const,
      valuesAlignment: '4',
      lastWeekendOff: 'Last weekend I took off was about 3 months ago. It was possible because my team stepped up to handle operations, but I still received several urgent calls that required my attention.',
      missionWritten: 'yes' as const,
      scheduleAlignment: '3',
      exitStrategy: 'B' as const,
      futureBackThinking: 'yes' as const,
      nonNegotiables: '1. Quality standards must never be compromised\n2. Customer satisfaction above short-term profits\n3. Team development and growth opportunities',
      businessWithout30Days: 'C' as const,
      delegationAccountability: 'yes' as const,
      rightPeopleConfidence: '4',
      teamDevelopmentTime: '3',
      retentionSystems: 'We offer flexible working arrangements, professional development budgets, regular one-on-ones, and performance-based bonuses. We also have a mentorship program and career progression pathways.',
      grossProfitMargin: 'yes' as const,
      cashFlowProcess: 'C' as const,
      pricingValue: '4',
      invoiceFollowUp: 'yes' as const,
      debtorCreditorTrends: 'Debtor days have increased from 35 to 42 days over the past year due to economic pressures on clients. Plan: Implement stricter credit checks and offer early payment discounts.',
      trackingItems: ['energy', 'wellbeing'],
      purposeInfluencesBuying: 'yes' as const,
      purposeCommercialValue: '4',
      staffEmpowerment: 'We have green champions in each department who lead sustainability initiatives. Staff can propose environmental projects with dedicated budget allocation and implementation support.',
      netZeroCommitment: 'yes' as const
    };

    Object.entries(sampleData).forEach(([key, value]) => {
      form.setValue(key as any, value);
    });

    toast({
      title: "Form auto-filled",
      description: "Sample data has been populated for development testing.",
    });
  };

  const onSubmit = async (data: z.infer<typeof businessHealthScoreSchema>) => {
    setIsSubmitting(true);
    console.log('Business Health Score data:', data);
    
    try {
      // Here you would send the data to your webhook or backend
      // For now, we'll just simulate success
      
      onComplete();
      toast({
        title: "Business Health Score submitted successfully",
        description: "Your business health assessment has been completed.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission error",
        description: "There was an error submitting your assessment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const trackingOptions = [
    { id: 'energy', label: 'Energy use / emissions' },
    { id: 'wellbeing', label: 'Staff well-being' },
    { id: 'ethics', label: 'Supply chain ethics' },
    { id: 'community', label: 'Community outcomes' },
    { id: 'none', label: 'None' }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Development Auto-Fill Button */}
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={autoFillForm}
            className="mb-4"
          >
            Auto-Fill (Dev)
          </Button>
        </div>

        {/* STRESS & LEADERSHIP */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-primary">STRESS & LEADERSHIP</h3>
          
          <FormField
            control={form.control}
            name="hoursInVsOn"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>How many hours per week do you spend working "in" the business vs. "on" the business? (Rating Scale 1–5)</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem key={rating} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={rating.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">{rating}</FormLabel>
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
            name="businessWithoutYou"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Can your business operate for one week without you being contacted?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
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

          <FormField
            control={form.control}
            name="stressManagement"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Which best describes your approach to managing stress?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="A" />
                      </FormControl>
                      <FormLabel className="font-normal">A: I suppress it and keep pushing</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="B" />
                      </FormControl>
                      <FormLabel className="font-normal">B: I work longer hours to catch up</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="C" />
                      </FormControl>
                      <FormLabel className="font-normal">C: I recognise it and adapt routines</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="D" />
                      </FormControl>
                      <FormLabel className="font-normal">D: I use coaching or reflection proactively</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valuesAlignment"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>To what degree do you feel you're making decisions aligned with your personal values and legacy? (Rating Scale 1–5)</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem key={rating} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={rating.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">{rating}</FormLabel>
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
            name="lastWeekendOff"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe the last moment you took a full weekend off. What made it possible (or impossible)?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your last full weekend off..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* PLAN */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-primary">PLAN</h3>
          
          <FormField
            control={form.control}
            name="missionWritten"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Have you written down your mission in 1–2 sentences and shared it with your team?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
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

          <FormField
            control={form.control}
            name="scheduleAlignment"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>To what extent does your weekly schedule align with your stated mission and long-term business vision? (Rating Scale 1–5)</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem key={rating} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={rating.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">{rating}</FormLabel>
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
            name="exitStrategy"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>What is your defined exit strategy?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="A" />
                      </FormControl>
                      <FormLabel className="font-normal">A: Retire and close</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="B" />
                      </FormControl>
                      <FormLabel className="font-normal">B: Sell (trade sale or MBO)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="C" />
                      </FormControl>
                      <FormLabel className="font-normal">C: Employee buyout or succession</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="D" />
                      </FormControl>
                      <FormLabel className="font-normal">D: Pass on to family</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="E" />
                      </FormControl>
                      <FormLabel className="font-normal">E: None</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="futureBackThinking"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Do you use 'future-back thinking' to guide your strategic decisions and resource planning?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
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

          <FormField
            control={form.control}
            name="nonNegotiables"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What are the top three non-negotiables in your business plan that help you say 'no' to distractions?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List your top three non-negotiables..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* PEOPLE */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-primary">PEOPLE</h3>
          
          <FormField
            control={form.control}
            name="businessWithout30Days"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Which best describes how your business would operate without you for 30 days?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="A" />
                      </FormControl>
                      <FormLabel className="font-normal">A: Would collapse entirely</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="B" />
                      </FormControl>
                      <FormLabel className="font-normal">B: Would struggle, but survive</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="C" />
                      </FormControl>
                      <FormLabel className="font-normal">C: Would continue, but at reduced effectiveness</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="D" />
                      </FormControl>
                      <FormLabel className="font-normal">D: Would operate smoothly with minimal disruption</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delegationAccountability"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Are the people you delegate to accountable for measurable results?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
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

          <FormField
            control={form.control}
            name="rightPeopleConfidence"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>How confident are you that each person in your business is in the right seat, doing the right job? (Rating Scale 1–5)</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem key={rating} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={rating.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">{rating}</FormLabel>
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
            name="teamDevelopmentTime"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>How much time do you spend hiring, mentoring, or developing your team per month? (Rating Scale 1–5)</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem key={rating} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={rating.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">{rating}</FormLabel>
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
            name="retentionSystems"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What systems do you use to retain good people — beyond just salary?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your retention systems..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* PROFITS */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-primary">PROFITS</h3>
          
          <FormField
            control={form.control}
            name="grossProfitMargin"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Do you know your gross profit margin by product/service — and is it above 30%?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
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

          <FormField
            control={form.control}
            name="cashFlowProcess"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Which best describes your cash flow process?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="A" />
                      </FormControl>
                      <FormLabel className="font-normal">A: No forecasting</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="B" />
                      </FormControl>
                      <FormLabel className="font-normal">B: Basic spreadsheet, updated irregularly</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="C" />
                      </FormControl>
                      <FormLabel className="font-normal">C: Monthly forecast with triggers & review</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="D" />
                      </FormControl>
                      <FormLabel className="font-normal">D: Weekly rolling forecast</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricingValue"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>How well does your pricing reflect your value and strategic positioning? (Rating Scale 1–5)</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem key={rating} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={rating.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">{rating}</FormLabel>
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
            name="invoiceFollowUp"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Do you consistently follow up on unpaid invoices within 7 days of due date?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
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

          <FormField
            control={form.control}
            name="debtorCreditorTrends"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What trends have you observed in your debtor/creditor days over the past 12 months? What's your plan?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the trends and your plan..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* PURPOSE & IMPACT */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-primary">PURPOSE & IMPACT</h3>
          
          <FormField
            control={form.control}
            name="trackingItems"
            render={() => (
              <FormItem>
                <FormLabel>Which of the following does your business actively track? (Select all that apply)</FormLabel>
                <div className="space-y-2">
                  {trackingOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="trackingItems"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option.id])
                                  : field.onChange(field.value?.filter((value) => value !== option.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{option.label}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purposeInfluencesBuying"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Do your environmental/social commitments influence buying decisions of your top 3 clients?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
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

          <FormField
            control={form.control}
            name="purposeCommercialValue"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>To what extent do you believe your purpose adds commercial value to your business? (Rating Scale 1–5)</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem key={rating} className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={rating.toString()} />
                        </FormControl>
                        <FormLabel className="font-normal">{rating}</FormLabel>
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
            name="staffEmpowerment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How do you empower staff to take ownership of social or environmental goals?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe how you empower staff..."
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
            name="netZeroCommitment"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Have you publicly stated a Net Zero or ESG commitment?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
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
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Assessment"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BusinessHealthScoreForm;
