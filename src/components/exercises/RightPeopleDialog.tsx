
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Users, Plus, Trash2, CheckCircle, User } from 'lucide-react';

interface RightPeopleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  understandsRole: string;
  hasSkillsAndAttitude: string;
  isMotivated: string;
  wouldRehire: string;
  changesNeeded: string;
}

const RightPeopleDialog: React.FC<RightPeopleDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: '',
      role: '',
      understandsRole: '',
      hasSkillsAndAttitude: '',
      isMotivated: '',
      wouldRehire: '',
      changesNeeded: ''
    }
  ]);

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      role: '',
      understandsRole: '',
      hasSkillsAndAttitude: '',
      isMotivated: '',
      wouldRehire: '',
      changesNeeded: ''
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const removeTeamMember = (id: string) => {
    if (teamMembers.length > 1) {
      setTeamMembers(prev => prev.filter(member => member.id !== id));
    }
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleSubmit = () => {
    console.log('Right People in Right Seats assessment:', teamMembers);
    onComplete();
  };

  const handleReset = () => {
    setTeamMembers([
      {
        id: '1',
        name: '',
        role: '',
        understandsRole: '',
        hasSkillsAndAttitude: '',
        isMotivated: '',
        wouldRehire: '',
        changesNeeded: ''
      }
    ]);
  };

  const isFormComplete = teamMembers.every(member => 
    member.name.trim() && 
    member.role.trim() && 
    member.understandsRole && 
    member.hasSkillsAndAttitude && 
    member.isMotivated && 
    member.wouldRehire &&
    member.changesNeeded.trim()
  );

  const completedMembers = teamMembers.filter(member => 
    member.name.trim() && 
    member.role.trim() && 
    member.understandsRole && 
    member.hasSkillsAndAttitude && 
    member.isMotivated && 
    member.wouldRehire &&
    member.changesNeeded.trim()
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            Exercise 15: Are the Right People in the Right Seats?
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            This exercise helps you assess whether your team members are playing to their strengths — 
            a key part of reducing stress and building a high-performance business.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {teamMembers.map((member, index) => (
              <Card key={member.id} className="border-0 shadow-sm bg-blue-50 border border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white shadow-sm text-blue-600">
                        <User className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base text-gray-800">
                        Team Member {index + 1}
                      </CardTitle>
                      {member.name.trim() && member.role.trim() && member.understandsRole && 
                       member.hasSkillsAndAttitude && member.isMotivated && member.wouldRehire &&
                       member.changesNeeded.trim() && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {teamMembers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTeamMember(member.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`name-${member.id}`} className="text-sm font-medium text-gray-700">
                        Name
                      </Label>
                      <Input
                        id={`name-${member.id}`}
                        placeholder="Team member name"
                        value={member.name}
                        onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`role-${member.id}`} className="text-sm font-medium text-gray-700">
                        Role
                      </Label>
                      <Input
                        id={`role-${member.id}`}
                        placeholder="Current role/position"
                        value={member.role}
                        onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                        className="bg-white border-gray-200"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Do they clearly understand their role and responsibilities?
                    </Label>
                    <RadioGroup
                      value={member.understandsRole}
                      onValueChange={(value) => updateTeamMember(member.id, 'understandsRole', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`understands-yes-${member.id}`} />
                        <Label htmlFor={`understands-yes-${member.id}`} className="text-sm">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`understands-no-${member.id}`} />
                        <Label htmlFor={`understands-no-${member.id}`} className="text-sm">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="somewhat" id={`understands-somewhat-${member.id}`} />
                        <Label htmlFor={`understands-somewhat-${member.id}`} className="text-sm">Somewhat</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Do they have the skills and attitude to succeed in that role?
                    </Label>
                    <RadioGroup
                      value={member.hasSkillsAndAttitude}
                      onValueChange={(value) => updateTeamMember(member.id, 'hasSkillsAndAttitude', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="absolutely" id={`skills-absolutely-${member.id}`} />
                        <Label htmlFor={`skills-absolutely-${member.id}`} className="text-sm">Absolutely</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="partially" id={`skills-partially-${member.id}`} />
                        <Label htmlFor={`skills-partially-${member.id}`} className="text-sm">Partially</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-really" id={`skills-not-really-${member.id}`} />
                        <Label htmlFor={`skills-not-really-${member.id}`} className="text-sm">Not really</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Are they energised and motivated by what they do?
                    </Label>
                    <RadioGroup
                      value={member.isMotivated}
                      onValueChange={(value) => updateTeamMember(member.id, 'isMotivated', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="most-days" id={`motivated-most-${member.id}`} />
                        <Label htmlFor={`motivated-most-${member.id}`} className="text-sm">Most days</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="occasionally" id={`motivated-occasionally-${member.id}`} />
                        <Label htmlFor={`motivated-occasionally-${member.id}`} className="text-sm">Occasionally</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rarely" id={`motivated-rarely-${member.id}`} />
                        <Label htmlFor={`motivated-rarely-${member.id}`} className="text-sm">Rarely</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Would you enthusiastically rehire them for the same role today?
                    </Label>
                    <RadioGroup
                      value={member.wouldRehire}
                      onValueChange={(value) => updateTeamMember(member.id, 'wouldRehire', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`rehire-yes-${member.id}`} />
                        <Label htmlFor={`rehire-yes-${member.id}`} className="text-sm">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maybe" id={`rehire-maybe-${member.id}`} />
                        <Label htmlFor={`rehire-maybe-${member.id}`} className="text-sm">Maybe</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`rehire-no-${member.id}`} />
                        <Label htmlFor={`rehire-no-${member.id}`} className="text-sm">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor={`changes-${member.id}`} className="text-sm font-medium text-gray-700">
                      What changes — if any — would help this person thrive more?
                    </Label>
                    <Textarea
                      id={`changes-${member.id}`}
                      placeholder="New training? Clearer expectations? A different role altogether?"
                      value={member.changesNeeded}
                      onChange={(e) => updateTeamMember(member.id, 'changesNeeded', e.target.value)}
                      className="min-h-[80px] resize-none text-sm bg-white border-gray-200 mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={addTeamMember}
              className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Team Member
            </Button>
          </div>
        </ScrollArea>

        {completedMembers > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Progress: {completedMembers} of {teamMembers.length} team members assessed
              </span>
            </div>
            <div className="text-xs text-blue-700">
              Complete all assessments to identify team optimization opportunities.
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {completedMembers > 0 && (
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

export default RightPeopleDialog;
