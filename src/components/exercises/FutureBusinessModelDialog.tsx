
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Grid, CheckCircle, Target } from 'lucide-react';

interface FutureBusinessModelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const FutureBusinessModelDialog: React.FC<FutureBusinessModelDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [answers, setAnswers] = useState({
    customerSegments: '',
    valueProposition: '',
    channels: '',
    customerRelationships: '',
    revenueStreams: '',
    keyResources: '',
    keyActivities: '',
    keyPartners: '',
    costStructure: '',
    environmentalSocialImpact: ''
  });

  const canvasElements = [
    {
      id: 'customerSegments',
      title: 'Customer Segments',
      subtitle: 'Who are your key customer groups?',
      placeholder: 'E.g., Small business owners, environmentally conscious consumers, tech-savvy millennials...'
    },
    {
      id: 'valueProposition',
      title: 'Value Proposition',
      subtitle: 'What unique value do you offer them?',
      placeholder: 'E.g., Sustainable solutions that save time and money, expert guidance with personal touch...'
    },
    {
      id: 'channels',
      title: 'Channels',
      subtitle: 'How do you reach your customers?',
      placeholder: 'E.g., Online platform, direct sales, retail partnerships, social media, referrals...'
    },
    {
      id: 'customerRelationships',
      title: 'Customer Relationships',
      subtitle: 'How do you build and maintain trust?',
      placeholder: 'E.g., Personal service, community building, regular check-ins, loyalty programs...'
    },
    {
      id: 'revenueStreams',
      title: 'Revenue Streams',
      subtitle: 'How do you make money?',
      placeholder: 'E.g., Product sales, subscription fees, consulting services, licensing, commissions...'
    },
    {
      id: 'keyResources',
      title: 'Key Resources',
      subtitle: 'What assets do you need (people, tools, funding)?',
      placeholder: 'E.g., Skilled team, technology platform, manufacturing equipment, brand reputation...'
    },
    {
      id: 'keyActivities',
      title: 'Key Activities',
      subtitle: 'What are the essential things you must do to deliver value?',
      placeholder: 'E.g., Product development, marketing, customer support, quality control, research...'
    },
    {
      id: 'keyPartners',
      title: 'Key Partners',
      subtitle: 'Who helps you deliver (suppliers, allies, networks)?',
      placeholder: 'E.g., Suppliers, distributors, technology partners, industry associations, advisors...'
    },
    {
      id: 'costStructure',
      title: 'Cost Structure',
      subtitle: 'What are your biggest costs and how do they scale?',
      placeholder: 'E.g., Staff salaries, materials, technology, marketing, facilities, fixed vs variable costs...'
    },
    {
      id: 'environmentalSocialImpact',
      title: 'Environmental & Social Impact',
      subtitle: 'What positive or negative impact does your business have — and how can you improve it?',
      placeholder: 'E.g., Carbon footprint, local job creation, waste reduction, community support, ethical sourcing...'
    }
  ];

  const handleAnswerChange = (elementId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [elementId]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Future-Fit Business Model Canvas responses:', answers);
    onComplete();
  };

  const handleReset = () => {
    setAnswers({
      customerSegments: '',
      valueProposition: '',
      channels: '',
      customerRelationships: '',
      revenueStreams: '',
      keyResources: '',
      keyActivities: '',
      keyPartners: '',
      costStructure: '',
      environmentalSocialImpact: ''
    });
  };

  const requiredElements = Object.keys(answers);
  const isFormComplete = requiredElements.every(key => answers[key as keyof typeof answers].trim().length > 0);
  const completedCount = requiredElements.filter(key => answers[key as keyof typeof answers].trim().length > 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Grid className="h-5 w-5" />
            </div>
            Exercise 10: Complete Your Future-Fit Business Model Canvas
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            This adapted canvas helps you think holistically about your business — not just how it makes money, 
            but also its impact on people and planet. It's a one-page strategy snapshot.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {canvasElements.map((element, index) => (
              <Card 
                key={element.id} 
                className={`border-0 shadow-sm ${
                  element.id === 'environmentalSocialImpact' ? 'md:col-span-2 lg:col-span-3' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-semibold mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base text-gray-800 mb-1">
                        {element.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 font-medium">
                        {element.subtitle}
                      </p>
                    </div>
                    {answers[element.id as keyof typeof answers].trim().length > 0 && (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Label htmlFor={element.id} className="sr-only">
                      {element.title}
                    </Label>
                    <Textarea
                      id={element.id}
                      placeholder={element.placeholder}
                      value={answers[element.id as keyof typeof answers]}
                      onChange={(e) => handleAnswerChange(element.id, e.target.value)}
                      className="min-h-[80px] resize-none text-sm"
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
                Progress: {completedCount} of {requiredElements.length} canvas elements completed
              </span>
            </div>
            <div className="text-xs text-purple-700">
              Complete all elements to create your comprehensive business model canvas.
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
            Complete Canvas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FutureBusinessModelDialog;
