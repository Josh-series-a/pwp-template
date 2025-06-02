
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, CheckCircle, Save } from 'lucide-react';
import { exerciseService } from '@/utils/exerciseService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface StressAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const StressAssessmentDialog: React.FC<StressAssessmentDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [selectedResponses, setSelectedResponses] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const stressResponses = [
    "Look for thrills or over-indulge",
    "Stop taking things seriously",
    "Become directive, even aggressive",
    "Make snap decisions and tell people what to do",
    "Become over-friendly",
    "Become more demanding",
    "Become obsessive about detail",
    "Withdraw",
    "Become unable to make a decision",
    "Feel unable to act until every possibility has been explored",
    "Withdraw to solve problems by yourself",
    "Ignore other people",
    "Ignore facts that do not fit your viewpoint"
  ];

  // Load existing answers when dialog opens
  useEffect(() => {
    if (isOpen && user) {
      loadExistingAnswers();
    }
  }, [isOpen, user]);

  const loadExistingAnswers = async () => {
    try {
      const existingAnswer = await exerciseService.getExerciseAnswer(1);
      if (existingAnswer && existingAnswer.answers.selectedResponses) {
        setSelectedResponses(existingAnswer.answers.selectedResponses);
      }
    } catch (error) {
      console.error('Error loading existing answers:', error);
    }
  };

  const handleResponseToggle = (response: string) => {
    setSelectedResponses(prev => 
      prev.includes(response)
        ? prev.filter(r => r !== response)
        : [...prev, response]
    );
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save your progress.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await exerciseService.saveExerciseAnswer({
        exercise_id: 1,
        exercise_title: "How Does Stress Affect You?",
        answers: { selectedResponses },
        progress: selectedResponses.length > 0 ? 50 : 0,
        status: 'in-progress'
      });

      toast({
        title: "Progress saved",
        description: "Your stress assessment progress has been saved.",
      });
    } catch (error) {
      console.error('Error saving exercise:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to complete this exercise.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await exerciseService.saveExerciseAnswer({
        exercise_id: 1,
        exercise_title: "How Does Stress Affect You?",
        answers: { selectedResponses },
        progress: 100,
        status: 'completed'
      });

      console.log('Stress assessment responses:', selectedResponses);
      onComplete();
    } catch (error) {
      console.error('Error completing exercise:', error);
      toast({
        title: "Error",
        description: "Failed to complete the exercise. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedResponses([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <Brain className="h-5 w-5" />
            </div>
            Exercise 1: How Does Stress Affect You?
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            This exercise will help you recognise how stress impacts your decision-making and relationships. 
            Understanding your patterns can make you a more effective and reflective leader.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-lg text-gray-800">
                How do you react under stress?
              </CardTitle>
              <p className="text-sm text-gray-600 font-medium">
                (Tick all that apply — or reflect honestly on your tendencies)
              </p>
            </CardHeader>
            
            <CardContent className="px-0 space-y-3">
              <div className="text-sm font-medium text-gray-700 mb-4">Do you:</div>
              
              {stressResponses.map((response, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <Checkbox
                    id={`stress-${index}`}
                    checked={selectedResponses.includes(response)}
                    onCheckedChange={() => handleResponseToggle(response)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={`stress-${index}`}
                    className="text-sm leading-relaxed cursor-pointer group-hover:text-primary transition-colors flex-1"
                  >
                    {response}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </ScrollArea>

        {selectedResponses.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Selected {selectedResponses.length} response{selectedResponses.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="text-xs text-blue-700">
              Your responses will help create a personalized stress management profile.
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {selectedResponses.length > 0 && (
              <Button variant="ghost" onClick={handleReset}>
                Reset
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {selectedResponses.length > 0 && (
              <Button 
                variant="outline"
                onClick={handleSave}
                disabled={isSaving}
                className="min-w-[100px]"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Progress'}
              </Button>
            )}
            <Button 
              onClick={handleSubmit}
              disabled={selectedResponses.length === 0 || isSaving}
              className="min-w-[120px]"
            >
              {isSaving ? 'Saving...' : 'Complete Exercise'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StressAssessmentDialog;
