
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Megaphone, CheckCircle, Target } from 'lucide-react';

interface ReachCustomersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ReachCustomersDialog: React.FC<ReachCustomersDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [answers, setAnswers] = useState({
    customerLookup: '',
    bestChannels: '',
    attentionMessages: '',
    engagementPreference: '',
    newChannelTest: ''
  });

  const questions = [
    {
      id: 'customerLookup',
      title: 'Where does your customer look for solutions like yours?',
      subtitle: '(Online search, social media, local events, trade shows, word-of-mouth, etc.)',
      placeholder: 'E.g., Google searches, LinkedIn, industry conferences, referrals from colleagues...'
    },
    {
      id: 'bestChannels',
      title: 'Which channels have brought in your best customers so far?',
      subtitle: '(Think about the clients who spend well, return often, or refer others — how did they find you?)',
      placeholder: 'E.g., Word-of-mouth referrals, LinkedIn networking, local business groups...'
    },
    {
      id: 'attentionMessages',
      title: 'What messages grab their attention?',
      subtitle: '(Emotional hooks? Logic? Urgency? Purpose-driven appeal?)',
      placeholder: 'E.g., "Save time and reduce stress", "Expert advice you can trust", "Results guaranteed"...'
    },
    {
      id: 'engagementPreference',
      title: 'How do they prefer to engage or buy?',
      subtitle: '(Face-to-face, online, by phone, through recommendations, via partners?)',
      placeholder: 'E.g., Initial phone consultation followed by in-person meeting, online booking with email support...'
    },
    {
      id: 'newChannelTest',
      title: "What's one new channel or tactic you could test this month?",
      subtitle: '(E.g., Instagram ads, referral scheme, networking event, newsletter)',
      placeholder: 'E.g., Start a monthly newsletter, attend local business networking events, create LinkedIn content...'
    }
  ];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Reach Customers responses:', answers);
    onComplete();
  };

  const handleReset = () => {
    setAnswers({
      customerLookup: '',
      bestChannels: '',
      attentionMessages: '',
      engagementPreference: '',
      newChannelTest: ''
    });
  };

  const requiredAnswers = ['customerLookup', 'bestChannels', 'attentionMessages', 'engagementPreference', 'newChannelTest'];
  const isFormComplete = requiredAnswers.every(key => answers[key as keyof typeof answers].trim().length > 0);
  const completedCount = requiredAnswers.filter(key => answers[key as keyof typeof answers].trim().length > 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Megaphone className="h-5 w-5" />
            </div>
            Exercise 8: How to Reach Your Customers
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Knowing who your customer is isn't enough — you also need a strategy for how to reach them. 
            This exercise helps you define your communication and sales channels.
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
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Progress: {completedCount} of {requiredAnswers.length} questions completed
              </span>
            </div>
            <div className="text-xs text-blue-700">
              Complete all questions to develop your customer reach strategy.
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

export default ReachCustomersDialog;
