
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Users, CheckCircle, Target } from 'lucide-react';

interface KnowYourCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const KnowYourCustomerDialog: React.FC<KnowYourCustomerDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [answers, setAnswers] = useState({
    idealCustomer: '',
    problemSolving: '',
    successLooks: '',
    whereTheyAre: '',
    frustrations: ''
  });

  const questions = [
    {
      id: 'idealCustomer',
      title: 'Who is your ideal customer?',
      subtitle: 'Describe them — individual, business, sector, age, values, location, size, etc.',
      placeholder: 'E.g., Small business owners aged 30-50 in professional services, located in urban areas, who value efficiency and growth...'
    },
    {
      id: 'problemSolving',
      title: 'What problem are they trying to solve when they come to you?',
      subtitle: 'Be specific. What pain or need are they feeling?',
      placeholder: 'E.g., They struggle with managing their time effectively while trying to grow their business...'
    },
    {
      id: 'successLooks',
      title: 'What does success look like for them?',
      subtitle: 'What are they really hoping your product or service helps them achieve?',
      placeholder: 'E.g., They want to double their revenue while working fewer hours and having more work-life balance...'
    },
    {
      id: 'whereTheyAre',
      title: 'Where are they — geographically, online, and emotionally?',
      subtitle: 'Where do they live, hang out, or seek help? How do they feel before finding you?',
      placeholder: 'E.g., Located in major cities, active on LinkedIn and industry forums, feeling overwhelmed and frustrated...'
    },
    {
      id: 'frustrations',
      title: 'What frustrates them about current solutions?',
      subtitle: 'What annoys them about competitors or doing nothing?',
      placeholder: 'E.g., Current solutions are too complex, expensive, or don\'t address their specific needs...'
    }
  ];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Know your customer responses:', answers);
    onComplete();
  };

  const handleReset = () => {
    setAnswers({
      idealCustomer: '',
      problemSolving: '',
      successLooks: '',
      whereTheyAre: '',
      frustrations: ''
    });
  };

  const requiredAnswers = ['idealCustomer', 'problemSolving', 'successLooks', 'whereTheyAre', 'frustrations'];
  const isFormComplete = requiredAnswers.every(key => answers[key as keyof typeof answers].trim().length > 0);
  const completedCount = requiredAnswers.filter(key => answers[key as keyof typeof answers].trim().length > 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Target className="h-5 w-5" />
            </div>
            Exercise 6: Know Your Customer
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            If you try to sell to everyone, you end up selling to no one. This exercise helps you identify 
            who your ideal customer really is — so you can focus your time, energy, and money where it counts.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {questions.map((question, index) => (
              <Card key={question.id} className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold mt-1">
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
                  <div className="space-y-2">
                    <Label htmlFor={question.id} className="sr-only">
                      {question.title}
                    </Label>
                    <Textarea
                      id={question.id}
                      placeholder={question.placeholder}
                      value={answers[question.id as keyof typeof answers]}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {completedCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Progress: {completedCount} of {requiredAnswers.length} questions answered
              </span>
            </div>
            <div className="text-xs text-blue-700">
              Complete all questions to define your ideal customer profile.
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

export default KnowYourCustomerDialog;
