import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  BarChart2,
  Users,
  PiggyBank,
  ClipboardList,
  Plus
} from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Exercises = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  // Mock data for exercises
  const exercises = [
    { 
      id: 1, 
      title: "Define Your Mission Statement", 
      progress: 60, 
      status: "in-progress",
      intro: "Clarify your company's purpose and direction to guide all strategic decisions.",
      category: "planning",
      sections: 5,
      completedSections: 3,
      tags: ["planning"]
    },
    { 
      id: 2, 
      title: "Team Skills Assessment", 
      progress: 30, 
      status: "in-progress",
      intro: "Evaluate your team's capabilities and identify gaps that need addressing.",
      category: "people",
      sections: 4,
      completedSections: 1,
      tags: ["people"]
    },
    { 
      id: 3, 
      title: "Future Growth Planning", 
      progress: 15, 
      status: "in-progress",
      intro: "Map out your company's growth trajectory for the next 3-5 years.",
      category: "planning",
      sections: 6,
      completedSections: 1,
      tags: ["planning", "profit"]
    },
    { 
      id: 4, 
      title: "Customer Persona Development", 
      progress: 0, 
      status: "suggested",
      intro: "Create detailed profiles of your ideal customers to improve targeting.",
      category: "planning",
      sections: 3,
      completedSections: 0,
      tags: ["planning"]
    },
    { 
      id: 5, 
      title: "Profit Margin Analysis", 
      progress: 0, 
      status: "suggested",
      intro: "Analyze your current profit margins and identify opportunities for improvement.",
      category: "profit",
      sections: 5,
      completedSections: 0,
      tags: ["profit"]
    },
    { 
      id: 6, 
      title: "Leadership Development Plan", 
      progress: 100, 
      status: "completed",
      intro: "Create a structured plan to develop leadership capabilities in your organization.",
      category: "people",
      sections: 4,
      completedSections: 4,
      tags: ["people"]
    },
  ];

  const [activeTab, setActiveTab] = useState("all");

  const filteredExercises = exercises.filter(exercise => {
    if (activeTab === "all") return true;
    return exercise.status === activeTab || exercise.tags.includes(activeTab);
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "people":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "profit":
        return <PiggyBank className="h-4 w-4 text-green-500" />;
      case "planning":
        return <ClipboardList className="h-4 w-4 text-purple-500" />;
      default:
        return <BarChart2 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "suggested":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  // Fetch companies for the current user
  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('company_name')
        .eq('user_id', user?.id)
        .distinct();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load companies",
          variant: "destructive",
        });
        return [];
      }

      return data?.map(item => item.company_name) || [];
    },
    enabled: !!user?.id,
  });

  return (
    <DashboardLayout title="Exercises">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <p className="text-muted-foreground">
            Interactive worksheets pulled from the book, powered by AI
          </p>
          <div className="flex gap-4 items-center">
            <Select
              value={selectedCompany}
              onValueChange={setSelectedCompany}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => navigate('/dashboard/reports/new')}>
              <Plus className="mr-2 h-4 w-4" />
              New Company
            </Button>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(exercise.category)}
                    <CardTitle className="text-lg">{exercise.title}</CardTitle>
                  </div>
                  {getStatusIcon(exercise.status)}
                </div>
                <CardDescription className="flex justify-between items-center">
                  <span>
                    {exercise.completedSections}/{exercise.sections} sections complete
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    exercise.status === 'completed' ? 'bg-green-100 text-green-800' :
                    exercise.status === 'in-progress' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {exercise.status === 'in-progress' ? 'In Progress' : 
                     exercise.status === 'completed' ? 'Completed' : 'Suggested'}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress 
                  value={exercise.progress} 
                  className="h-2 mb-4" 
                />
                <p className="text-sm text-muted-foreground">{exercise.intro}</p>
                <div className="flex gap-2 mt-4">
                  {exercise.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={exercise.status === "completed" ? "outline" : "default"} 
                  className="w-full"
                >
                  {exercise.status === "completed" ? "View" : 
                   exercise.status === "in-progress" ? "Continue" : "Start"} 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Exercises;
