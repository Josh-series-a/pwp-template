
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, Heart, Sparkles, Building2, FileText, Users, Target, DollarSign, TreePine, Upload } from 'lucide-react';
import NewCompanyForm from './NewCompanyForm';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/hooks/useCredits';

interface RunAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitComplete: (companyName: string, exerciseTitle: string, pitchDeckUrl?: string, type?: string, companyId?: string) => Promise<string> | string | void;
}

const RunAnalysisModal: React.FC<RunAnalysisModalProps> = ({ 
  isOpen, 
  onClose,
  onSubmitComplete
}) => {
  const { user } = useAuth();
  const { healthScoreCredits, checkHealthScoreCredits } = useCredits();
  const [currentStep, setCurrentStep] = useState(1);

  const requiredHealthScoreCredits = 1;
  const hasEnoughHealthScoreCredits = checkHealthScoreCredits(requiredHealthScoreCredits);

  const navigationSteps = [
    { 
      step: 1, 
      title: 'Company Information', 
      icon: Building2,
      description: 'Basic company details'
    },
    { 
      step: 2, 
      title: 'Document Upload', 
      icon: Upload,
      description: 'Upload your pitch deck'
    }
  ];

  const handleSubmitComplete = async (companyName: string, exerciseTitle: string, pitchDeckUrl?: string, companyId?: string) => {
    console.log("Analysis complete with pitchDeckUrl:", pitchDeckUrl, "and companyId:", companyId);
    const result = await onSubmitComplete(companyName, exerciseTitle, pitchDeckUrl, 'New', companyId);
    return typeof result === 'string' ? result : companyId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 gap-0 bg-gradient-to-br from-background via-background/95 to-muted/30 overflow-hidden">
        {/* Close Button - Outside the main content */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background/80 hover:bg-background z-50 shadow-md"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full overflow-hidden">
          {/* Left Panel - Hero Section */}
          <div className="relative flex flex-col justify-center p-6 md:p-8 lg:p-12 bg-gradient-to-br from-primary/5 via-primary/3 to-background overflow-y-auto">
            <div className="max-w-lg mx-auto lg:mx-0 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-bold text-foreground">
                      Business Health Score
                    </DialogTitle>
                    <Badge variant="secondary" className="gap-2 px-3 py-1 mt-2">
                      <Sparkles className="h-3 w-3" />
                      AI-Powered Analysis
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Navigation Steps */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground mb-4">Assessment Steps</h3>
                {navigationSteps.map((navStep) => {
                  const IconComponent = navStep.icon;
                  const isActive = currentStep === navStep.step;
                  const isCompleted = currentStep > navStep.step;
                  
                  return (
                    <div
                      key={navStep.step}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-primary/10 border border-primary/20' 
                          : isCompleted 
                          ? 'bg-muted/50 border border-border/30' 
                          : 'bg-background/30 border border-border/20'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <IconComponent className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {navStep.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {navStep.description}
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {navStep.step}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Credits Display */}
              <div className="p-6 rounded-2xl bg-background/80 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="font-semibold">Health Score Credits</span>
                  </div>
                  <Badge variant={hasEnoughHealthScoreCredits ? "default" : "destructive"} className="gap-2 px-3 py-1">
                    <Heart className="h-3 w-3" />
                    {healthScoreCredits?.health_score_credits || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                  <span className="text-sm text-muted-foreground">Cost per analysis</span>
                  <span className="text-sm font-medium">{requiredHealthScoreCredits} credit</span>
                </div>
              </div>

              {/* Warning if insufficient credits */}
              {!hasEnoughHealthScoreCredits && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
                  <div className="flex items-center gap-2 text-destructive">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Insufficient credits. You need {requiredHealthScoreCredits} credit but have {healthScoreCredits?.health_score_credits || 0}.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl"></div>
          </div>

          {/* Right Panel - Form Section */}
          <div className="flex flex-col overflow-hidden min-h-0">
            <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12">
              <div className="max-w-2xl mx-auto h-full">
                {hasEnoughHealthScoreCredits ? (
                  <NewCompanyForm onComplete={handleSubmitComplete} userData={user} onStepChange={setCurrentStep} />
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
                    <div className="p-6 rounded-full bg-destructive/10">
                      <Heart className="h-12 w-12 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Credits Required</h3>
                      <p className="text-muted-foreground">
                        You need at least {requiredHealthScoreCredits} health score credit to start a new analysis.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RunAnalysisModal;
