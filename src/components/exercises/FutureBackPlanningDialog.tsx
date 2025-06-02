
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, CheckCircle, Calendar, ArrowLeft, Target } from 'lucide-react';

interface FutureBackPlanningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const FutureBackPlanningDialog: React.FC<FutureBackPlanningDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [answers, setAnswers] = useState({
    year5Vision: '',
    year4Requirements: '',
    year3Requirements: '',
    year2Requirements: '',
    year1Requirements: '',
    todayActions: ''
  });

  const timelineSteps = [
    {
      id: 'year5Vision',
      title: 'Years 5-6: Ultimate Vision',
      subtitle: 'Where do you want your business to be in 5-6 years?',
      description: 'Describe your ideal future: success metrics, clients, revenues, team size, impact',
      placeholder: 'Visualize your ultimate goal in detail...',
      icon: Target,
      color: 'purple'
    },
    {
      id: 'year4Requirements',
      title: 'Year 4: Pre-Goal Foundation',
      subtitle: 'One year before achieving your vision',
      description: 'What resources and achievements must already be in place?',
      placeholder: 'What would your business need to look like to make the final leap?',
      icon: Calendar,
      color: 'blue'
    },
    {
      id: 'year3Requirements',
      title: 'Year 3: Building Momentum',
      subtitle: 'Two years before your vision',
      description: 'What had to happen to reach Year 4?',
      placeholder: 'Key milestones and capabilities needed...',
      icon: Calendar,
      color: 'indigo'
    },
    {
      id: 'year2Requirements',
      title: 'Year 2: Establishing Systems',
      subtitle: 'Three years before your vision',
      description: 'What foundations had to be laid to reach Year 3?',
      placeholder: 'Systems, processes, and growth needed...',
      icon: Calendar,
      color: 'cyan'
    },
    {
      id: 'year1Requirements',
      title: 'Year 1: Initial Progress',
      subtitle: 'Four years before your vision',
      description: 'What early wins and developments were needed?',
      placeholder: 'First steps and early achievements...',
      icon: Calendar,
      color: 'green'
    },
    {
      id: 'todayActions',
      title: 'Today: Starting Point',
      subtitle: 'What must you start doing now?',
      description: 'Based on your backwards planning, what actions do you need to take today?',
      placeholder: 'Immediate actions and first steps...',
      icon: ArrowLeft,
      color: 'amber'
    }
  ];

  const handleAnswerChange = (stepId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [stepId]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Future-back planning responses:', answers);
    onComplete();
  };

  const handleReset = () => {
    setAnswers({
      year5Vision: '',
      year4Requirements: '',
      year3Requirements: '',
      year2Requirements: '',
      year1Requirements: '',
      todayActions: ''
    });
  };

  const isFormComplete = Object.values(answers).every(answer => answer.trim().length > 0);
  const completedCount = Object.values(answers).filter(answer => answer.trim().length > 0).length;

  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      cyan: 'bg-cyan-100 text-cyan-600 border-cyan-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      amber: 'bg-amber-100 text-amber-600 border-amber-200'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <ClipboardList className="h-5 w-5" />
            </div>
            Exercise 3: Use Future-Back Planning
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Envision your ideal future and work backwards step by step to figure out how to get there. 
            This is powerful for setting strategy and avoiding reactive thinking.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {timelineSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <Card key={step.id} className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(step.color)}`}>
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-800 mb-1">
                          {step.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 font-medium mb-2">
                          {step.subtitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          {step.description}
                        </p>
                      </div>
                      {answers[step.id as keyof typeof answers].trim().length > 0 && (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Textarea
                      placeholder={step.placeholder}
                      value={answers[step.id as keyof typeof answers]}
                      onChange={(e) => handleAnswerChange(step.id, e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

        {completedCount > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Timeline Progress: {completedCount} of {timelineSteps.length} steps completed
              </span>
            </div>
            <div className="text-xs text-purple-700">
              Complete all timeline steps to create your future-back planning roadmap.
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

export default FutureBackPlanningDialog;
