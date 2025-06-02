
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, Target, Shield, CheckCircle } from 'lucide-react';

interface SWOTAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const SWOTAnalysisDialog: React.FC<SWOTAnalysisDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [answers, setAnswers] = useState({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: ''
  });

  const swotQuadrants = [
    {
      id: 'strengths',
      title: 'S – Strengths',
      subtitle: 'What are your business\'s internal strengths?',
      placeholder: 'e.g., loyal customers, skilled team, strong brand, unique IP, excellent location, proven track record, efficient processes...',
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: 'weaknesses',
      title: 'W – Weaknesses',
      subtitle: 'What internal areas are holding you back?',
      placeholder: 'e.g., inconsistent service, limited cashflow, over-reliance on one person, outdated technology, lack of marketing...',
      icon: TrendingDown,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600'
    },
    {
      id: 'opportunities',
      title: 'O – Opportunities',
      subtitle: 'What external trends or shifts could you benefit from?',
      placeholder: 'e.g., market growth, partnerships, new customer needs, tech changes, regulatory changes, competitor gaps...',
      icon: Target,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'threats',
      title: 'T – Threats',
      subtitle: 'What external risks could harm your business?',
      placeholder: 'e.g., competitors, regulation, economic changes, supply chain issues, changing customer preferences...',
      icon: Shield,
      color: 'amber',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600'
    }
  ];

  const handleAnswerChange = (quadrantId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [quadrantId]: value
    }));
  };

  const handleSubmit = () => {
    console.log('SWOT Analysis responses:', answers);
    onComplete();
  };

  const handleReset = () => {
    setAnswers({
      strengths: '',
      weaknesses: '',
      opportunities: '',
      threats: ''
    });
  };

  const requiredQuadrants = Object.keys(answers);
  const isFormComplete = requiredQuadrants.every(key => answers[key as keyof typeof answers].trim().length > 0);
  const completedCount = requiredQuadrants.filter(key => answers[key as keyof typeof answers].trim().length > 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Target className="h-5 w-5" />
            </div>
            Exercise 11: Prepare Your SWOT Analysis
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            A well-done SWOT helps you face reality clearly — building on your strengths, addressing weaknesses, 
            seizing opportunities, and preparing for threats.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {swotQuadrants.map((quadrant) => (
              <Card 
                key={quadrant.id} 
                className={`border-0 shadow-sm ${quadrant.bgColor} ${quadrant.borderColor} border`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 p-2 rounded-lg bg-white ${quadrant.iconColor} shadow-sm`}>
                      <quadrant.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base text-gray-800 mb-1">
                        {quadrant.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 font-medium">
                        {quadrant.subtitle}
                      </p>
                    </div>
                    {answers[quadrant.id as keyof typeof answers].trim().length > 0 && (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Label htmlFor={quadrant.id} className="sr-only">
                      {quadrant.title}
                    </Label>
                    <Textarea
                      id={quadrant.id}
                      placeholder={quadrant.placeholder}
                      value={answers[quadrant.id as keyof typeof answers]}
                      onChange={(e) => handleAnswerChange(quadrant.id, e.target.value)}
                      className="min-h-[120px] resize-none text-sm bg-white border-gray-200"
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
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Progress: {completedCount} of {requiredQuadrants.length} SWOT quadrants completed
              </span>
            </div>
            <div className="text-xs text-purple-700">
              Complete all quadrants to get a comprehensive view of your strategic position.
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
            Complete SWOT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SWOTAnalysisDialog;
