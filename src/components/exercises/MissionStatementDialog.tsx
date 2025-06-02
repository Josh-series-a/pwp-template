
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, CheckCircle, Lightbulb } from 'lucide-react';

interface MissionStatementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const MissionStatementDialog: React.FC<MissionStatementDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [answers, setAnswers] = useState({
    whoWeHelp: '',
    whatWeHelp: '',
    howWeProvide: ''
  });

  const questions = [
    {
      id: 'whoWeHelp',
      title: 'Who do we help, empower, or equip?',
      subtitle: '(Who is our target customer — individuals, groups, sectors?)',
      placeholder: 'Describe your target customers...'
    },
    {
      id: 'whatWeHelp',
      title: 'What do we help them achieve, reach, or eliminate?',
      subtitle: '(What benefit or problem do we address for them?)',
      placeholder: 'Describe the benefits or problems you address...'
    },
    {
      id: 'howWeProvide',
      title: 'How do we provide, build, create, or reduce that?',
      subtitle: '(What specific product/service/action delivers the change?)',
      placeholder: 'Describe your specific products/services/actions...'
    }
  ];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Mission statement responses:', answers);
    onComplete();
  };

  const handleReset = () => {
    setAnswers({
      whoWeHelp: '',
      whatWeHelp: '',
      howWeProvide: ''
    });
  };

  const isFormComplete = Object.values(answers).every(answer => answer.trim().length > 0);
  const completedCount = Object.values(answers).filter(answer => answer.trim().length > 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <ClipboardList className="h-5 w-5" />
            </div>
            Exercise 2: Create a Mission Statement
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            This exercise helps align your business with a clear, motivating direction — essential for making sound decisions, 
            attracting the right customers and staff, and staying focused.
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
                  <Textarea
                    placeholder={question.placeholder}
                    value={answers[question.id as keyof typeof answers]}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {completedCount > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Progress: {completedCount} of {questions.length} questions answered
              </span>
            </div>
            <div className="text-xs text-purple-700">
              Complete all questions to create your mission statement framework.
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

export default MissionStatementDialog;
