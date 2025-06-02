
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, CheckCircle, Target } from 'lucide-react';

interface GeographicReachDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const GeographicReachDialog: React.FC<GeographicReachDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [answers, setAnswers] = useState({
    currentCustomerLocations: '',
    desiredOperatingArea: '',
    currentConstraints: '',
    marketOpportunities: '',
    practicalNextStep: ''
  });

  const questions = [
    {
      id: 'currentCustomerLocations',
      title: 'Where are your current customers located?',
      subtitle: '(Be as specific as possible — town, region, postcode areas, online zones.)',
      placeholder: 'E.g., Central London (EC1, EC2), Birmingham city center, online customers across UK...'
    },
    {
      id: 'desiredOperatingArea',
      title: 'Where do you want to be operating?',
      subtitle: '(Same area? Regional expansion? Nationwide? Global?)',
      placeholder: 'E.g., Expand from London to Manchester and Birmingham, nationwide UK coverage, European markets...'
    },
    {
      id: 'currentConstraints',
      title: 'What constraints limit your reach currently?',
      subtitle: '(e.g., delivery capability, regulation, staff, knowledge of the area.)',
      placeholder: 'E.g., Limited delivery radius, need local licenses, lack of regional contacts, language barriers...'
    },
    {
      id: 'marketOpportunities',
      title: 'What opportunities exist in neighbouring or similar markets?',
      subtitle: '(e.g., similar demographic areas, nearby cities, aligned sectors online.)',
      placeholder: 'E.g., Similar affluent suburbs, university towns, cities with tech hubs, online niche communities...'
    },
    {
      id: 'practicalNextStep',
      title: "What's one practical step you could take to explore or test a new geographic area?",
      subtitle: '(E.g., attend an event, run a local ad, contact a partner.)',
      placeholder: 'E.g., Attend networking event in target city, run Google Ads for specific postcodes, partner with local business...'
    }
  ];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Geographic Reach responses:', answers);
    onComplete();
  };

  const handleReset = () => {
    setAnswers({
      currentCustomerLocations: '',
      desiredOperatingArea: '',
      currentConstraints: '',
      marketOpportunities: '',
      practicalNextStep: ''
    });
  };

  const requiredAnswers = ['currentCustomerLocations', 'desiredOperatingArea', 'currentConstraints', 'marketOpportunities', 'practicalNextStep'];
  const isFormComplete = requiredAnswers.every(key => answers[key as keyof typeof answers].trim().length > 0);
  const completedCount = requiredAnswers.filter(key => answers[key as keyof typeof answers].trim().length > 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <MapPin className="h-5 w-5" />
            </div>
            Exercise 9: Define Your Geographic Reach
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            This exercise sharpens your focus by identifying where you operate best. Knowing your true geographic market 
            saves time, effort, and money — and helps you scale intentionally.
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Progress: {completedCount} of {requiredAnswers.length} questions completed
              </span>
            </div>
            <div className="text-xs text-green-700">
              Complete all questions to define your geographic reach strategy.
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

export default GeographicReachDialog;
