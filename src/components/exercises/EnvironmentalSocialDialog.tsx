
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Leaf, CheckCircle, Users } from 'lucide-react';

interface EnvironmentalSocialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const EnvironmentalSocialDialog: React.FC<EnvironmentalSocialDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [answers, setAnswers] = useState({
    trackEnvironmentalImpact: '',
    wasteManagement: '',
    sustainableSuppliers: '',
    socialImpact: '',
    staffEngagement: ''
  });

  const questions = [
    {
      id: 'trackEnvironmentalImpact',
      title: 'Do you track the environmental impact of your business?',
      subtitle: '(e.g., energy use, waste, emissions)',
      options: ['Yes', 'No', 'Not sure']
    },
    {
      id: 'wasteManagement',
      title: 'Do you have measures in place to reduce waste and manage resources efficiently?',
      subtitle: '(e.g., recycling, reducing packaging)',
      options: ['Yes, we have a formal plan', 'Yes, but informally', 'No']
    },
    {
      id: 'sustainableSuppliers',
      title: 'Do you use sustainable or ethical suppliers?',
      subtitle: '(e.g., fair trade, local, low-carbon providers)',
      options: ['Always', 'Sometimes', 'Never']
    },
    {
      id: 'socialImpact',
      title: 'Do you consider your business\'s social impact?',
      subtitle: '(e.g., local employment, fair wages, inclusive hiring)',
      options: ['Regularly', 'Occasionally', 'Not at all']
    },
    {
      id: 'staffEngagement',
      title: 'Are staff engaged in environmental or social initiatives?',
      subtitle: '(e.g., volunteering, green teams, community projects)',
      options: ['Yes', 'No', 'Not sure']
    }
  ];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Environmental and social impact responses:', answers);
    onComplete();
  };

  const handleReset = () => {
    setAnswers({
      trackEnvironmentalImpact: '',
      wasteManagement: '',
      sustainableSuppliers: '',
      socialImpact: '',
      staffEngagement: ''
    });
  };

  const requiredAnswers = ['trackEnvironmentalImpact', 'wasteManagement', 'sustainableSuppliers', 'socialImpact', 'staffEngagement'];
  const isFormComplete = requiredAnswers.every(key => answers[key as keyof typeof answers].trim().length > 0);
  const completedCount = requiredAnswers.filter(key => answers[key as keyof typeof answers].trim().length > 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <Leaf className="h-5 w-5" />
            </div>
            Exercise 5: Environmental and Social Impact Self-Assessment
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            This exercise helps you evaluate how your business is currently engaging with environmental 
            and social responsibility — a key part of being future-fit and resilient.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {questions.map((question, index) => (
              <Card key={question.id} className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-semibold mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-800 mb-2">
                        {question.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 font-medium">
                        {question.subtitle}
                      </p>
                    </div>
                    {answers[question.id as keyof typeof answers].trim().length > 0 && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <RadioGroup
                    value={answers[question.id as keyof typeof answers]}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                    className="space-y-3"
                  >
                    {question.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                        <Label 
                          htmlFor={`${question.id}-${option}`} 
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {completedCount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Progress: {completedCount} of {requiredAnswers.length} questions answered
              </span>
            </div>
            <div className="text-xs text-green-700">
              Complete all questions to assess your environmental and social impact.
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

export default EnvironmentalSocialDialog;
