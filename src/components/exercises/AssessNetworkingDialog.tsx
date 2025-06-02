
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BarChart3, Users, Target, MessageSquare, Lightbulb, CheckCircle } from 'lucide-react';

interface AssessNetworkingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const AssessNetworkingDialog: React.FC<AssessNetworkingDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [answers, setAnswers] = useState({
    valuableActivities: '',
    typeOfPeople: '',
    followUpFrequency: '',
    perception: '',
    improvement: ''
  });

  const questions = [
    {
      id: 'valuableActivities',
      title: 'Most Valuable Networking Activities',
      subtitle: 'Which networking activities have delivered the most value so far?',
      placeholder: 'Be specific about referrals, partnerships, ideas, visibility, or other benefits you\'ve gained...',
      icon: BarChart3,
      color: 'blue',
      type: 'textarea'
    },
    {
      id: 'typeOfPeople',
      title: 'Types of People You Meet',
      subtitle: 'What types of people do you tend to meet — and are they aligned with your goals?',
      placeholder: 'Are they potential customers, suppliers, collaborators, or none of the above? How well do they match your objectives?',
      icon: Users,
      color: 'green',
      type: 'textarea'
    },
    {
      id: 'followUpFrequency',
      title: 'Follow-up Frequency',
      subtitle: 'How often do you follow up with new contacts after an event?',
      icon: MessageSquare,
      color: 'purple',
      type: 'radio',
      options: [
        { value: 'always', label: 'Always' },
        { value: 'sometimes', label: 'Sometimes' },
        { value: 'rarely', label: 'Rarely' }
      ]
    },
    {
      id: 'perception',
      title: 'Your Professional Perception',
      subtitle: 'What do people associate with you or your business after meeting you?',
      placeholder: 'Are you memorable? Clear? Trustworthy? What impression do you leave?',
      icon: Target,
      color: 'amber',
      type: 'textarea'
    },
    {
      id: 'improvement',
      title: 'Networking Improvement Strategy',
      subtitle: 'What one thing could you do to be more intentional and effective in your networking?',
      placeholder: 'E.g., refine your intro pitch, set monthly targets, deepen existing connections...',
      icon: Lightbulb,
      color: 'red',
      type: 'textarea'
    }
  ];

  const getIconColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      amber: 'text-amber-600',
      red: 'text-red-600'
    };
    return colorMap[color] || 'text-gray-600';
  };

  const getBgColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      amber: 'bg-amber-50 border-amber-200',
      red: 'bg-red-50 border-red-200'
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
    console.log('Assess Your Networking responses:', answers);
    onComplete();
  };

  const handleReset = () => {
    setAnswers({
      valuableActivities: '',
      typeOfPeople: '',
      followUpFrequency: '',
      perception: '',
      improvement: ''
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
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            Exercise 13: Assess Your Networking
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Now that you've mapped out your networking opportunities, this exercise helps you evaluate 
            how effective your current efforts are — and where to improve.
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
                    
                    {question.type === 'radio' ? (
                      <RadioGroup
                        value={answers[question.id as keyof typeof answers]}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                        className="space-y-3"
                      >
                        {question.options?.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                            <Label 
                              htmlFor={`${question.id}-${option.value}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <Textarea
                        id={question.id}
                        placeholder={question.placeholder}
                        value={answers[question.id as keyof typeof answers]}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="min-h-[100px] resize-none text-sm bg-white border-gray-200"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {completedCount > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Progress: {completedCount} of {requiredQuestions.length} assessment areas completed
              </span>
            </div>
            <div className="text-xs text-purple-700">
              Complete all sections to get a comprehensive view of your networking effectiveness.
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

export default AssessNetworkingDialog;
