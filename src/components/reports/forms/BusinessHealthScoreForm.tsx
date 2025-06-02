
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Target, 
  Users, 
  TrendingUp, 
  Heart,
  CheckCircle2,
  Star
} from 'lucide-react';

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

  const RatingScale = ({ field, max = 5 }: { field: any; max?: number }) => (
    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-2">
      {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
        <div key={rating} className="flex flex-col items-center gap-2">
          <RadioGroupItem 
            value={rating.toString()} 
            id={`rating-${rating}`}
            className="w-5 h-5"
          />
          <label htmlFor={`rating-${rating}`} className="text-sm font-medium text-muted-foreground">
            {rating}
          </label>
        </div>
      ))}
    </RadioGroup>
  );

  const sections = [
    {
      id: 'stress',
      title: 'Stress & Leadership',
      icon: Brain,
      color: 'from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20',
      borderColor: 'border-rose-200 dark:border-rose-800'
    },
    {
      id: 'plan',
      title: 'Plan',
      icon: Target,
      color: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'people',
      title: 'People',
      icon: Users,
      color: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      id: 'profits',
      title: 'Profits',
      icon: TrendingUp,
      color: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      id: 'purpose',
      title: 'Purpose & Impact',
      icon: Heart,
      color: 'from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Business Health Score Assessment</h1>
                <p className="text-sm text-muted-foreground">
                  Complete all sections to receive your comprehensive business health analysis
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-2">
              <Star className="h-3 w-3" />
              AI-Powered Analysis
            </Badge>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="container mx-auto px-6 py-8">
          
          {/* Development Auto-Fill Button */}
          <div className="flex justify-end mb-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={autoFillForm}
              className="gap-2"
            >
              <Star className="h-4 w-4" />
              Auto-Fill (Dev)
            </Button>
          </div>

          <div className="space-y-8">
            {/* STRESS & LEADERSHIP */}
            <Card className={`border-2 ${sections[0].borderColor} bg-gradient-to-r ${sections[0].color}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
                    <Brain className="h-5 w-5" />
                  </div>
                  {sections[0].title}
                  <Badge variant="outline" className="ml-auto">1 of 5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <FormField
                  control={form.control}
                  name="hoursInVsOn"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        How many hours per week do you spend working "in" the business vs. "on" the business?
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        Rate from 1 (mostly working "in") to 5 (mostly working "on")
                      </FormDescription>
                      <FormControl>
                        <RatingScale field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="businessWithoutYou"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        Can your business operate for one week without you being contacted?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="business-yes" />
                            <label htmlFor="business-yes" className="font-medium">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="business-no" />
                            <label htmlFor="business-no" className="font-medium">No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="stressManagement"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        Which best describes your approach to managing stress?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="A" id="stress-A" />
                            <label htmlFor="stress-A" className="font-medium flex-1">I suppress it and keep pushing</label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="B" id="stress-B" />
                            <label htmlFor="stress-B" className="font-medium flex-1">I work longer hours to catch up</label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="C" id="stress-C" />
                            <label htmlFor="stress-C" className="font-medium flex-1">I recognise it and adapt routines</label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="D" id="stress-D" />
                            <label htmlFor="stress-D" className="font-medium flex-1">I use coaching or reflection proactively</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="valuesAlignment"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        To what degree do you feel you're making decisions aligned with your personal values and legacy?
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        Rate from 1 (not aligned) to 5 (completely aligned)
                      </FormDescription>
                      <FormControl>
                        <RatingScale field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="lastWeekendOff"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        Describe the last moment you took a full weekend off. What made it possible (or impossible)?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your last full weekend off and what enabled or prevented it..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* PLAN */}
            <Card className={`border-2 ${sections[1].borderColor} bg-gradient-to-r ${sections[1].color}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                    <Target className="h-5 w-5" />
                  </div>
                  {sections[1].title}
                  <Badge variant="outline" className="ml-auto">2 of 5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <FormField
                  control={form.control}
                  name="missionWritten"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        Have you written down your mission in 1–2 sentences and shared it with your team?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="mission-yes" />
                            <label htmlFor="mission-yes" className="font-medium">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="mission-no" />
                            <label htmlFor="mission-no" className="font-medium">No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="scheduleAlignment"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        To what extent does your weekly schedule align with your stated mission and long-term business vision?
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        Rate from 1 (not aligned) to 5 (completely aligned)
                      </FormDescription>
                      <FormControl>
                        <RatingScale field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="exitStrategy"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">What is your defined exit strategy?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="A" id="exit-A" />
                            <label htmlFor="exit-A" className="font-medium flex-1">Retire and close</label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="B" id="exit-B" />
                            <label htmlFor="exit-B" className="font-medium flex-1">Sell (trade sale or MBO)</label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="C" id="exit-C" />
                            <label htmlFor="exit-C" className="font-medium flex-1">Employee buyout or succession</label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="D" id="exit-D" />
                            <label htmlFor="exit-D" className="font-medium flex-1">Pass on to family</label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="E" id="exit-E" />
                            <label htmlFor="exit-E" className="font-medium flex-1">None</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="futureBackThinking"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        Do you use 'future-back thinking' to guide your strategic decisions and resource planning?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="future-yes" />
                            <label htmlFor="future-yes" className="font-medium">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="future-no" />
                            <label htmlFor="future-no" className="font-medium">No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="nonNegotiables"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        What are the top three non-negotiables in your business plan that help you say 'no' to distractions?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List your top three non-negotiables..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* PEOPLE */}
            <Card className={`border-2 ${sections[2].borderColor} bg-gradient-to-r ${sections[2].color}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                    <Users className="h-5 w-5" />
                  </div>
                  {sections[2].title}
                  <Badge variant="outline" className="ml-auto">3 of 5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <FormField
                  control={form.control}
                  name="businessWithout30Days"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        Which best describes how your business would operate without you for 30 days?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="A" id="days-A" />
                            <label htmlFor="days-A" className="font-medium flex-1">Would collapse entirely</label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="B" id="days-B" />
                            <label htmlFor="days-B" className="font-medium flex-1">Would struggle, but survive</label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="C" id="days-C" />
                            <label htmlFor="days-C" className="font-medium flex-1">Would continue, but at reduced effectiveness</label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="D" id="days-D" />
                            <label htmlFor="days-D" className="font-medium flex-1">Would operate smoothly with minimal disruption</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="delegationAccountability"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        Are the people you delegate to accountable for measurable results?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="delegation-yes" />
                            <label htmlFor="delegation-yes" className="font-medium">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="delegation-no" />
                            <label htmlFor="delegation-no" className="font-medium">No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="rightPeopleConfidence"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        How confident are you that each person in your business is in the right seat, doing the right job?
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        Rate from 1 (not confident) to 5 (very confident)
                      </FormDescription>
                      <FormControl>
                        <RatingScale field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="teamDevelopmentTime"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        How much time do you spend hiring, mentoring, or developing your team per month?
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        Rate from 1 (very little) to 5 (significant time)
                      </FormDescription>
                      <FormControl>
                        <RatingScale field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="retentionSystems"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        What systems do you use to retain good people — beyond just salary?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your retention systems and strategies..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* PROFITS */}
            <Card className={`border-2 ${sections[3].borderColor} bg-gradient-to-r ${sections[3].color}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  {sections[3].title}
                  <Badge variant="outline" className="ml-auto">4 of 5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <FormField
                  control={form.control}
                  name="grossProfitMargin"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        Do you know your gross profit margin by product/service — and is it above 30%?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="profit-yes" />
                            <label htmlFor="profit-yes" className="font-medium">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="profit-no" />
                            <label htmlFor="profit-no" className="font-medium">No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="cashFlowProcess"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">Which best describes your cash flow process?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="A" id="cash-A" />
                            <label htmlFor="cash-A" className="font-medium flex-1">No forecasting</label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="B" id="cash-B" />
                            <label htmlFor="cash-B" className="font-medium flex-1">Basic spreadsheet, updated irregularly</label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="C" id="cash-C" />
                            <label htmlFor="cash-C" className="font-medium flex-1">Monthly forecast with triggers & review</label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="D" id="cash-D" />
                            <label htmlFor="cash-D" className="font-medium flex-1">Weekly rolling forecast</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="pricingValue"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        How well does your pricing reflect your value and strategic positioning?
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        Rate from 1 (poorly) to 5 (very well)
                      </FormDescription>
                      <FormControl>
                        <RatingScale field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="invoiceFollowUp"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        Do you consistently follow up on unpaid invoices within 7 days of due date?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="invoice-yes" />
                            <label htmlFor="invoice-yes" className="font-medium">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="invoice-no" />
                            <label htmlFor="invoice-no" className="font-medium">No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="debtorCreditorTrends"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        What trends have you observed in your debtor/creditor days over the past 12 months? What's your plan?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the trends and your plan to address them..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* PURPOSE & IMPACT */}
            <Card className={`border-2 ${sections[4].borderColor} bg-gradient-to-r ${sections[4].color}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                    <Heart className="h-5 w-5" />
                  </div>
                  {sections[4].title}
                  <Badge variant="outline" className="ml-auto">5 of 5</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <FormField
                  control={form.control}
                  name="trackingItems"
                  render={() => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        Which of the following does your business actively track? (Select all that apply)
                      </FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {trackingOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="trackingItems"
                            render={({ field }) => (
                              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.id])
                                      : field.onChange(field.value?.filter((value) => value !== option.id))
                                  }}
                                />
                                <label className="font-medium flex-1">{option.label}</label>
                              </div>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="purposeInfluencesBuying"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        Do your environmental/social commitments influence buying decisions of your top 3 clients?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="purpose-yes" />
                            <label htmlFor="purpose-yes" className="font-medium">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="purpose-no" />
                            <label htmlFor="purpose-no" className="font-medium">No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="purposeCommercialValue"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        To what extent do you believe your purpose adds commercial value to your business?
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        Rate from 1 (no value) to 5 (significant value)
                      </FormDescription>
                      <FormControl>
                        <RatingScale field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="staffEmpowerment"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        How do you empower staff to take ownership of social or environmental goals?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe how you empower staff with social and environmental initiatives..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="netZeroCommitment"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        Have you publicly stated a Net Zero or ESG commitment?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="net-yes" />
                            <label htmlFor="net-yes" className="font-medium">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="net-no" />
                            <label htmlFor="net-no" className="font-medium">No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Submit Section */}
          <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-6 mt-8">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <Button type="button" variant="outline" onClick={onBack} className="gap-2">
                ← Back
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2 px-8">
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Submit Assessment
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BusinessHealthScoreForm;
