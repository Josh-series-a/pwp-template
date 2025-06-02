
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Lightbulb, CheckCircle, Target } from 'lucide-react';

interface OneOnOnePropositionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OneOnOnePropositionDialog: React.FC<OneOnOnePropositionDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [answers, setAnswers] = useState({
    businessStrengths: '',
    customerCares: '',
    magicOverlap: '',
    uniqueStatement: ''
  });

  const steps = [
    {
      id: 'businessStrengths',
      title: 'List what your business is good at — your strengths or differentiators.',
      subtitle: '(e.g., fast delivery, ethical sourcing, deep expertise, community connection)',
      placeholder: 'E.g., We have 20+ years of industry expertise, provide 24/7 customer support, use only sustainable materials...'
    },
    {
      id: 'customerCares',
      title: 'List what your customer cares about deeply.',
      subtitle: '(e.g., convenience, social impact, luxury feel, personalisation)',
      placeholder: 'E.g., They value convenience, want to make a positive environmental impact, care about quality and durability...'
    },
    {
      id: 'magicOverlap',
      title: 'Find the magic overlap — What\'s the unique combination only you can offer?',
      subtitle: 'This is your 1+1. For example: "Fast turnaround + social impact", "Affordable price + expert craftsmanship", "High-end look + recycled materials"',
      placeholder: 'E.g., Expert craftsmanship + sustainable materials, Fast delivery + personalized service...'
    },
    {
      id: 'uniqueStatement',
      title: 'Put it into a short sentence that finishes this: "Our business is the only one that..."',
      subtitle: 'Create your unique value proposition statement',
      placeholder: 'Our business is the only one that...'
    }
  ];

  const handleAnswerChange = (stepId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [stepId]: value
    }));
  };

  const handleSubmit = () => {
    console.log('1+1 Proposition responses:', answers);
    onComplete();
  };

  const handleReset = () => {
    setAnswers({
      businessStrengths: '',
      customerCares: '',
      magicOverlap: '',
      uniqueStatement: ''
    });
  };

  const requiredAnswers = ['businessStrengths', 'customerCares', 'magicOverlap', 'uniqueStatement'];
  const isFormComplete = requiredAnswers.every(key => answers[key as keyof typeof answers].trim().length > 0);
  const completedCount = requiredAnswers.filter(key => answers[key as keyof typeof answers].trim().length > 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Target className="h-5 w-5" />
            </div>
            Exercise 7: Create Your '1+1' Proposition
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            A "1+1 Proposition" is what makes you stand out. It's the special combination of two things 
            that makes your business uniquely valuable — and hard to copy.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card key={step.id} className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-800 mb-2">
                        Step {index + 1}: {step.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 font-medium">
                        {step.subtitle}
                      </p>
                    </div>
                    {answers[step.id as keyof typeof answers].trim().length > 0 && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Label htmlFor={step.id} className="sr-only">
                      {step.title}
                    </Label>
                    <Textarea
                      id={step.id}
                      placeholder={step.placeholder}
                      value={answers[step.id as keyof typeof answers]}
                      onChange={(e) => handleAnswerChange(step.id, e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {completedCount > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Progress: {completedCount} of {requiredAnswers.length} steps completed
              </span>
            </div>
            <div className="text-xs text-purple-700">
              Complete all steps to create your unique value proposition.
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {completedCount > 0 && (
              <Button variant="ghost" onClick={handleReset}>
                Reset
              </Button>
            )}
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormComplete}
            className="min-w-[120px]"
          >
            Complete Exercise
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OneOnOnePropositionDialog;
