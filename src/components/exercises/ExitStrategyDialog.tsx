
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, CheckCircle, DoorOpen, RadioGroup, RadioGroupItem, Label } from 'lucide-react';

interface ExitStrategyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ExitStrategyDialog: React.FC<ExitStrategyDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [answers, setAnswers] = useState({
    hasExitStrategy: '',
    exitStrategyDescription: '',
    exitTimeframe: '',
    exitPlan: '',
    stepsInPlace: '',
    timeAndResources: ''
  });

  const questions = [
    {
      id: 'hasExitStrategy',
      title: 'Do you have an exit strategy?',
      subtitle: 'Yes/No — If yes, describe it briefly.',
      type: 'radio',
      options: ['Yes', 'No'],
      followUp: 'exitStrategyDescription'
    },
    {
      id: 'exitTimeframe',
      title: 'When would you like to exit?',
      subtitle: 'E.g., in 5 years, at age 60, after hitting a revenue goal?',
      type: 'textarea',
      placeholder: 'Describe your target exit timeframe...'
    },
    {
      id: 'exitPlan',
      title: 'Do you have a plan to make that strategy happen in your timeframe?',
      subtitle: 'Describe the main steps, if any, that support this exit.',
      type: 'textarea',
      placeholder: 'Outline your main steps and plan...'
    },
    {
      id: 'stepsInPlace',
      title: 'What steps have you already put in place?',
      subtitle: 'Have you delegated, documented systems, built a leadership team, etc.?',
      type: 'textarea',
      placeholder: 'List the steps you have already taken...'
    },
    {
      id: 'timeAndResources',
      title: 'How much time and resources have you allocated to make this happen?',
      subtitle: 'Time each week/month? Budget for legal/financial support?',
      type: 'textarea',
      placeholder: 'Describe your time and resource allocation...'
    }
  ];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Exit strategy responses:', answers);
    onComplete();
  };

  const handleReset = () => {
    setAnswers({
      hasExitStrategy: '',
      exitStrategyDescription: '',
      exitTimeframe: '',
      exitPlan: '',
      stepsInPlace: '',
      timeAndResources: ''
    });
  };

  const requiredAnswers = ['hasExitStrategy', 'exitTimeframe', 'exitPlan', 'stepsInPlace', 'timeAndResources'];
  const isFormComplete = requiredAnswers.every(key => answers[key as keyof typeof answers].trim().length > 0);
  const completedCount = requiredAnswers.filter(key => answers[key as keyof typeof answers].trim().length > 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <DoorOpen className="h-5 w-5" />
            </div>
            Exercise 4: Define Your Exit Strategy
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Many business owners avoid thinking about the end — but knowing how you want to exit your business 
            brings clarity, motivation, and better day-to-day decisions.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {questions.map((question, index) => (
              <Card key={question.id} className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold mt-1">
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
                  {question.type === 'radio' ? (
                    <div className="space-y-4">
                      <div className="flex gap-6">
                        {question.options?.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`${question.id}-${option}`}
                              name={question.id}
                              value={option}
                              checked={answers[question.id as keyof typeof answers] === option}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                            />
                            <Label htmlFor={`${question.id}-${option}`} className="text-sm font-medium">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {answers.hasExitStrategy === 'Yes' && question.followUp && (
                        <Textarea
                          placeholder="Describe your exit strategy briefly..."
                          value={answers[question.followUp as keyof typeof answers]}
                          onChange={(e) => handleAnswerChange(question.followUp!, e.target.value)}
                          className="min-h-[80px] resize-none mt-3"
                        />
                      )}
                    </div>
                  ) : (
                    <Textarea
                      placeholder={question.placeholder}
                      value={answers[question.id as keyof typeof answers]}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {completedCount > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DoorOpen className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Progress: {completedCount} of {requiredAnswers.length} questions answered
              </span>
            </div>
            <div className="text-xs text-purple-700">
              Complete all questions to define your exit strategy framework.
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

export default ExitStrategyDialog;
