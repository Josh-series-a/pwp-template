
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Users, Calendar, Target, MapPin, Zap, CheckCircle } from 'lucide-react';

interface NetworkingOpportunitiesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const NetworkingOpportunitiesDialog: React.FC<NetworkingOpportunitiesDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [answers, setAnswers] = useState({
    currentNetworking: '',
    futureNetworks: '',
    targetConnections: '',
    customerGatherings: '',
    weeklyAction: ''
  });

  const questions = [
    {
      id: 'currentNetworking',
      title: 'Current Networking Activities',
      subtitle: 'Which networking events, groups, or communities do you already belong to?',
      placeholder: 'e.g., local chambers, trade shows, online forums, industry meetups, professional associations...',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'futureNetworks',
      title: 'Future Networking Opportunities',
      subtitle: 'What events or networks could you join in the next 3 months?',
      placeholder: 'Look for relevance, not just popularity. Think sector-specific or local events, conferences, meetups...',
      icon: Calendar,
      color: 'green'
    },
    {
      id: 'targetConnections',
      title: 'Target Connections',
      subtitle: 'Who are three people you\'d like to connect with this year — and why?',
      placeholder: 'Be intentional. Think of allies, advisors, or referrers. Include names/roles and why they would be valuable...',
      icon: Target,
      color: 'purple'
    },
    {
      id: 'customerGatherings',
      title: 'Customer & Peer Gatherings',
      subtitle: 'Where do your customers and peers already gather?',
      placeholder: 'That\'s where you need to be seen and heard. Think industry events, online communities, local meetups...',
      icon: MapPin,
      color: 'amber'
    },
    {
      id: 'weeklyAction',
      title: 'Weekly Action Plan',
      subtitle: 'What\'s one action you can take this week to build your network?',
      placeholder: 'E.g., attend an event, ask for an introduction, join a LinkedIn group, reach out to a contact...',
      icon: Zap,
      color: 'red'
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
    console.log('Networking Opportunities responses:', answers);
    onComplete();
  };

  const handleReset = () => {
    setAnswers({
      currentNetworking: '',
      futureNetworks: '',
      targetConnections: '',
      customerGatherings: '',
      weeklyAction: ''
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
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            Exercise 12: List Your Networking Opportunities
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Business growth is often about who you know. This exercise helps you map out where you can meet 
            valuable contacts — partners, customers, suppliers, or mentors.
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Progress: {completedCount} of {requiredQuestions.length} networking areas completed
              </span>
            </div>
            <div className="text-xs text-blue-700">
              Complete all sections to create your comprehensive networking strategy.
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

export default NetworkingOpportunitiesDialog;
