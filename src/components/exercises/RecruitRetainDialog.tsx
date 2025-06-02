
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserCheck, Users, Briefcase } from 'lucide-react';

interface RecruitRetainDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface RecruitmentData {
  currentRecruitmentMethods: string;
  prioritizedQualities: string;
  successfulHiringPractices: string;
  retentionFactors: string;
  improvementIdeas: string;
}

const RecruitRetainDialog: React.FC<RecruitRetainDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [formData, setFormData] = useState<RecruitmentData>({
    currentRecruitmentMethods: '',
    prioritizedQualities: '',
    successfulHiringPractices: '',
    retentionFactors: '',
    improvementIdeas: ''
  });

  const updateField = (field: keyof RecruitmentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Recruitment and Retention assessment:', formData);
    onComplete();
  };

  const handleReset = () => {
    setFormData({
      currentRecruitmentMethods: '',
      prioritizedQualities: '',
      successfulHiringPractices: '',
      retentionFactors: '',
      improvementIdeas: ''
    });
  };

  const isFormComplete = Object.values(formData).every(value => value.trim());
  const completedFields = Object.values(formData).filter(value => value.trim()).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <UserCheck className="h-5 w-5" />
            </div>
            Exercise 16: How Do You Recruit and Retain Staff?
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            The right people make or break your business. This exercise helps you review how you find, 
            choose, and keep great team members — especially those aligned with your values.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            <Card className="border-0 shadow-sm bg-blue-50 border border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-800 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  Recruitment Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="recruitment-methods" className="text-sm font-medium text-gray-700">
                    How do you currently recruit staff?
                  </Label>
                  <div className="text-xs text-gray-500 mb-2">
                    (Where do you advertise, and how do you assess candidates?)
                  </div>
                  <Textarea
                    id="recruitment-methods"
                    placeholder="Describe your current recruitment methods, channels, and assessment processes..."
                    value={formData.currentRecruitmentMethods}
                    onChange={(e) => updateField('currentRecruitmentMethods', e.target.value)}
                    className="min-h-[100px] resize-none text-sm bg-white border-gray-200"
                  />
                </div>

                <div>
                  <Label htmlFor="prioritized-qualities" className="text-sm font-medium text-gray-700">
                    What qualities do you prioritise beyond experience or qualifications?
                  </Label>
                  <div className="text-xs text-gray-500 mb-2">
                    (e.g., attitude, cultural fit, adaptability, passion for your mission)
                  </div>
                  <Textarea
                    id="prioritized-qualities"
                    placeholder="List the personal qualities, attitudes, and characteristics you value most..."
                    value={formData.prioritizedQualities}
                    onChange={(e) => updateField('prioritizedQualities', e.target.value)}
                    className="min-h-[100px] resize-none text-sm bg-white border-gray-200"
                  />
                </div>

                <div>
                  <Label htmlFor="successful-practices" className="text-sm font-medium text-gray-700">
                    What has worked well in your past hiring decisions?
                  </Label>
                  <div className="text-xs text-gray-500 mb-2">
                    (Think of your best hire — how did you find and choose them?)
                  </div>
                  <Textarea
                    id="successful-practices"
                    placeholder="Reflect on your most successful hires and what made those decisions effective..."
                    value={formData.successfulHiringPractices}
                    onChange={(e) => updateField('successfulHiringPractices', e.target.value)}
                    className="min-h-[100px] resize-none text-sm bg-white border-gray-200"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-green-50 border border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-800 flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  Retention Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="retention-factors" className="text-sm font-medium text-gray-700">
                    Why do people stay at your business — and why do they leave?
                  </Label>
                  <div className="text-xs text-gray-500 mb-2">
                    (Have you asked for feedback in exit interviews or reviews?)
                  </div>
                  <Textarea
                    id="retention-factors"
                    placeholder="Analyze what keeps people engaged and what causes them to leave..."
                    value={formData.retentionFactors}
                    onChange={(e) => updateField('retentionFactors', e.target.value)}
                    className="min-h-[100px] resize-none text-sm bg-white border-gray-200"
                  />
                </div>

                <div>
                  <Label htmlFor="improvement-ideas" className="text-sm font-medium text-gray-700">
                    What one improvement would make your recruitment or retention stronger?
                  </Label>
                  <div className="text-xs text-gray-500 mb-2">
                    (E.g., clearer onboarding, staff development, flexible working, recognition)
                  </div>
                  <Textarea
                    id="improvement-ideas"
                    placeholder="Identify the most impactful change you could make to improve your people processes..."
                    value={formData.improvementIdeas}
                    onChange={(e) => updateField('improvementIdeas', e.target.value)}
                    className="min-h-[100px] resize-none text-sm bg-white border-gray-200"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {completedFields > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Progress: {completedFields} of 5 questions completed
              </span>
            </div>
            <div className="text-xs text-blue-700">
              Complete all questions to identify opportunities for improving your recruitment and retention.
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {completedFields > 0 && (
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

export default RecruitRetainDialog;
