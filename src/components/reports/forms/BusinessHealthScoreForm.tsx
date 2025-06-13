
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { Badge } from '@/components/ui/badge';
import CreditsDisplay from '@/components/CreditsDisplay';
import { 
  CheckCircle2,
  Star,
  ArrowLeft,
  ArrowRight,
  Coins
} from 'lucide-react';
import StressLeadershipPage from './business-health-pages/StressLeadershipPage';
import PlanPage from './business-health-pages/PlanPage';
import PeoplePage from './business-health-pages/PeoplePage';
import ProfitsPage from './business-health-pages/ProfitsPage';
import PurposeImpactPage from './business-health-pages/PurposeImpactPage';
import PageTransition from '@/components/PageTransition';

// ... keep existing code (schema definition)
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
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const { toast } = useToast();
  const { user } = useAuth();
  const { healthScoreCredits, checkHealthScoreCredits, deductHealthScoreCredits } = useCredits();

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

  const requiredCredits = 1; // 1 Business Health Score = 1 Health Score Credit
  const hasEnoughCredits = checkHealthScoreCredits(requiredCredits);

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

  const pages = [
    { component: StressLeadershipPage, title: 'Stress & Leadership' },
    { component: PlanPage, title: 'Plan' },
    { component: PeoplePage, title: 'People' },
    { component: ProfitsPage, title: 'Profits' },
    { component: PurposeImpactPage, title: 'Purpose & Impact' }
  ];

  const handlePageTransition = (newPage: number, dir: 'next' | 'prev') => {
    if (newPage < 0 || newPage >= pages.length) return;
    
    setIsAnimating(true);
    setDirection(dir);
    
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsAnimating(false);
    }, 150);
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      handlePageTransition(currentPage + 1, 'next');
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      handlePageTransition(currentPage - 1, 'prev');
    }
  };

  const onSubmit = async (data: z.infer<typeof businessHealthScoreSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit this assessment.",
        variant: "destructive",
      });
      return;
    }

    if (!hasEnoughCredits) {
      toast({
        title: "Insufficient health score credits",
        description: `You need ${requiredCredits} health score credit to run a Business Health Score analysis. You currently have ${healthScoreCredits?.health_score_credits || 0} health score credits.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Business Health Score data:', data);
    
    try {
      // Deduct health score credits first
      const creditDeducted = await deductHealthScoreCredits(
        requiredCredits, 
        'Business Health Score Analysis', 
        'BUSINESS_HEALTH_SCORE'
      );

      if (!creditDeducted) {
        setIsSubmitting(false);
        return;
      }

      // Here you would send the data to your webhook or backend
      // For now, we'll just simulate success
      
      onComplete();
      toast({
        title: "Business Health Score submitted successfully",
        description: `Your business health assessment has been completed. ${requiredCredits} health score credit has been deducted.`,
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

  const CurrentPageComponent = pages[currentPage].component;

  // If no health score credits, show a disabled state
  if (!hasEnoughCredits && healthScoreCredits?.health_score_credits === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-card rounded-xl border shadow-lg">
          <div className="p-3 rounded-full bg-destructive/10 text-destructive mx-auto w-fit mb-4">
            <Coins className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Health Score Credits</h2>
          <p className="text-muted-foreground mb-6">
            You need at least 1 health score credit to run a Business Health Score analysis. 
            You currently have {healthScoreCredits?.health_score_credits || 0} health score credits.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={onBack} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Reports
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                  {pages[currentPage].title} - Page {currentPage + 1} of {pages.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Health Score Credits: {healthScoreCredits?.health_score_credits || 0}
                </span>
              </div>
              <Badge variant="secondary" className="gap-2">
                <Coins className="h-3 w-3" />
                Cost: {requiredCredits} health score credit
              </Badge>
              <Badge variant="secondary" className="gap-2">
                <Star className="h-3 w-3" />
                AI-Powered Analysis
              </Badge>
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
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Progress</span>
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
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="container mx-auto px-6 py-8">
          <PageTransition
            isAnimating={isAnimating}
            direction={direction}
            pageNumber={currentPage + 1}
            totalPages={pages.length}
          >
            <CurrentPageComponent form={form} />
          </PageTransition>

          {/* Navigation */}
          <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-6 mt-8">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={currentPage === 0 ? onBack : prevPage}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {currentPage === 0 ? 'Back to Reports' : 'Previous'}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {pages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      index === currentPage
                        ? 'bg-primary'
                        : index < currentPage
                        ? 'bg-primary/60'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {currentPage < pages.length - 1 ? (
                  <Button type="button" onClick={nextPage} className="gap-2">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !hasEnoughCredits} 
                    className="gap-2 px-8"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Submit Assessment ({requiredCredits} health score credit)
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BusinessHealthScoreForm;
