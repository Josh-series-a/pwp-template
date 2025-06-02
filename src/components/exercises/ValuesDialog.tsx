
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart, Users, Target, Star, Lightbulb, CheckCircle } from 'lucide-react';

interface ValuesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ValuesDialog: React.FC<ValuesDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [answers, setAnswers] = useState({
    admiredBehaviours: '',
    guidingValues: '',
    nonNegotiableValues: '',
    demonstratedValues: '',
    cultureWords: ''
  });

  const questions = [
    {
      id: 'admiredBehaviours',
      title: 'Admired Team Behaviours',
      subtitle: 'What behaviours do you most admire in your team (or wish to see)?',
      placeholder: 'e.g., honesty, initiative, empathy, persistence, creativity...',
      icon: Heart,
      color: 'pink',
      type: 'textarea'
    },
    {
      id: 'guidingValues',
      title: 'Your Guiding Values',
      subtitle: 'What values have guided your biggest decisions so far?',
      placeholder: 'Think of moments where you took a risk or made a stand — what mattered most?',
      icon: Star,
      color: 'amber',
      type: 'textarea'
    },
    {
      id: 'nonNegotiableValues',
      title: 'Non-Negotiable Values',
      subtitle: 'Which values would you never compromise — even if it cost you money?',
      placeholder: 'This shows what\'s truly non-negotiable...',
      icon: Target,
      color: 'red',
      type: 'textarea'
    },
    {
      id: 'demonstratedValues',
      title: 'Values in Action',
      subtitle: 'How do you demonstrate these values in your leadership style or daily operations?',
      placeholder: 'Values aren\'t just posters — they show up in meetings, feedback, hiring, etc.',
      icon: Users,
      color: 'blue',
      type: 'textarea'
    },
    {
      id: 'cultureWords',
      title: 'Culture Description',
      subtitle: 'What 3–5 words or phrases best describe your business culture at its best?',
      placeholder: 'Aim for real, not generic. e.g., "Tough love," "Keep it human," "Curious & kind"',
      icon: Lightbulb,
      color: 'purple',
      type: 'textarea'
    }
  ];

  const getIconColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      pink: 'text-pink-600',
      amber: 'text-amber-600',
      red: 'text-red-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600'
    };
    return colorMap[color] || 'text-gray-600';
  };

  const getBgColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      pink: 'bg-pink-50 border-pink-200',
      amber: 'bg-amber-50 border-amber-200',
      red: 'bg-red-50 border-red-200',
      blue: 'bg-blue-50 border-blue-200',
      purple: 'bg-purple-50 border-purple-200'
    };
    return colorMap[color] || 'bg-gray-50 border-gray-200';
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Think About Your Values responses:', answers);
    onComplete();
  };

  const handleReset = () => {
    setAnswers({
      admiredBehaviours: '',
      guidingValues: '',
      nonNegotiableValues: '',
      demonstratedValues: '',
      cultureWords: ''
    });
  };

  const requiredQuestions = Object.keys(answers);
  const isFormComplete = requiredQuestions.every(key => answers[key as keyof typeof answers].trim().length > 0);
  const completedCount = requiredQuestions.filter(key => answers[key as keyof typeof answers].trim().length > 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-pink-100 text-pink-600">
              <Heart className="h-5 w-5" />
            </div>
            Exercise 14: Think About Your Values
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Your business values shape culture, attract the right team, and guide decision-making — 
            especially when things get tough. This exercise helps you clarify and articulate them.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {questions.map((question) => (
              <Card 
                key={question.id} 
                className={`border-0 shadow-sm ${getBgColor(question.color)} border`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 p-2 rounded-lg bg-white shadow-sm ${getIconColor(question.color)}`}>
                      <question.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base text-gray-800 mb-1">
                        {question.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 font-medium">
                        {question.subtitle}
                      </p>
                    </div>
                    {answers[question.id as keyof typeof answers].trim().length > 0 && (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
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
                      className="min-h-[100px] resize-none text-sm bg-white border-gray-200"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {completedCount > 0 && (
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-medium text-pink-800">
                Progress: {completedCount} of {requiredQuestions.length} values areas completed
              </span>
            </div>
            <div className="text-xs text-pink-700">
              Complete all sections to define your core business values and culture.
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
            className="min-w-[140px]"
          >
            Complete Exercise
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ValuesDialog;
