
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  BarChart2,
  Users,
  PiggyBank,
  ClipboardList,
  Plus,
  Brain,
  TrendingUp,
  Target,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import StressAssessmentDialog from '@/components/exercises/StressAssessmentDialog';

const Exercises = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [activeTab, setActiveTab] = useState("all");
  const [isStressDialogOpen, setIsStressDialogOpen] = useState(false);

  // Enhanced exercises data with the stress assessment
  const exercises = [
    { 
      id: 1, 
      title: "How Does Stress Affect You?", 
      progress: 0, 
      status: "new",
      intro: "Recognise how stress impacts your decision-making and relationships. Understanding your patterns can make you a more effective and reflective leader.",
      category: "leadership",
      sections: 1,
      completedSections: 0,
      tags: ["leadership", "self-awareness"],
      priority: "high",
      estimatedTime: "5 min"
    },
    { 
      id: 2, 
      title: "Define Your Mission Statement", 
      progress: 60, 
      status: "in-progress",
      intro: "Clarify your company's purpose and direction to guide all strategic decisions.",
      category: "planning",
      sections: 5,
      completedSections: 3,
      tags: ["planning"],
      priority: "high",
      estimatedTime: "20 min"
    },
    { 
      id: 3, 
      title: "Team Skills Assessment", 
      progress: 30, 
      status: "in-progress",
      intro: "Evaluate your team's capabilities and identify gaps that need addressing.",
      category: "people",
      sections: 4,
      completedSections: 1,
      tags: ["people"],
      priority: "medium",
      estimatedTime: "15 min"
    },
    { 
      id: 4, 
      title: "Future Growth Planning", 
      progress: 15, 
      status: "in-progress",
      intro: "Map out your company's growth trajectory for the next 3-5 years.",
      category: "planning",
      sections: 6,
      completedSections: 1,
      tags: ["planning", "profit"],
      priority: "medium",
      estimatedTime: "30 min"
    },
    { 
      id: 5, 
      title: "Customer Persona Development", 
      progress: 0, 
      status: "suggested",
      intro: "Create detailed profiles of your ideal customers to improve targeting.",
      category: "planning",
      sections: 3,
      completedSections: 0,
      tags: ["planning"],
      priority: "low",
      estimatedTime: "25 min"
    },
    { 
      id: 6, 
      title: "Profit Margin Analysis", 
      progress: 0, 
      status: "suggested",
      intro: "Analyze your current profit margins and identify opportunities for improvement.",
      category: "profit",
      sections: 5,
      completedSections: 0,
      tags: ["profit"],
      priority: "medium",
      estimatedTime: "20 min"
    },
    { 
      id: 7, 
      title: "Leadership Development Plan", 
      progress: 100, 
      status: "completed",
      intro: "Create a structured plan to develop leadership capabilities in your organization.",
      category: "people",
      sections: 4,
      completedSections: 4,
      tags: ["people"],
      priority: "high",
      estimatedTime: "25 min"
    },
  ];

  // Filter buttons configuration
  const filterOptions = [
    { value: "all", label: "All" },
    { value: "new", label: "New" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "suggested", label: "Suggested" }
  ];

  const filteredExercises = exercises.filter(exercise => {
    if (activeTab === "all") return true;
    return exercise.status === activeTab;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "people":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "profit":
        return <PiggyBank className="h-4 w-4 text-green-500" />;
      case "planning":
        return <ClipboardList className="h-4 w-4 text-purple-500" />;
      case "leadership":
        return <Brain className="h-4 w-4 text-amber-500" />;
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
      case "new":
        return <Star className="h-4 w-4 text-blue-500" />;
      case "suggested":
        return <BookOpen className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case "medium":
        return <Badge variant="secondary" className="text-xs">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="text-xs">Low Priority</Badge>;
      default:
        return null;
    }
  };

  const handleExerciseClick = (exerciseId: number) => {
    if (exerciseId === 1) {
      setIsStressDialogOpen(true);
    } else {
      // Handle other exercises
      console.log(`Starting exercise ${exerciseId}`);
    }
  };

  // Fetch companies for the current user
  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['companies', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('company_name')
        .eq('user_id', user?.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load companies",
          variant: "destructive",
        });
        return [];
      }

      const uniqueCompanies = [...new Set(data?.map(item => item.company_name))];
      return uniqueCompanies || [];
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0]);
    }
  }, [companies, selectedCompany]);

  return (
    <DashboardLayout title={selectedCompany ? `${selectedCompany} Exercises` : "Exercises"}>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border border-purple-100/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative px-8 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                  Interactive Worksheets
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Business Development Exercises
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Interactive worksheets pulled from the book, powered by AI. Complete these exercises to gain valuable insights into your business and leadership approach.
              </p>
            </div>
          </div>
        </div>

        {/* Stats and Controls */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{exercises.filter(e => e.status === 'new').length}</div>
              <div className="text-sm text-gray-600">New</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{exercises.filter(e => e.status === 'in-progress').length}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{exercises.filter(e => e.status === 'completed').length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{exercises.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>

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

        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeTab === option.value ? "default" : "outline"}
              onClick={() => setActiveTab(option.value)}
              className="min-w-[100px]"
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(exercise.category)}
                    {getPriorityBadge(exercise.priority)}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(exercise.status)}
                    <span className="text-xs text-gray-500">{exercise.estimatedTime}</span>
                  </div>
                </div>
                
                <div>
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors leading-tight">
                    {exercise.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    <span className="font-medium">Exercise {exercise.id}</span> • {exercise.category}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">{exercise.intro}</p>
                
                {exercise.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{exercise.progress}%</span>
                    </div>
                    <Progress value={exercise.progress} className="h-2" />
                  </div>
                )}
                
                <div className="flex gap-2 flex-wrap">
                  {exercise.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  variant={exercise.status === "completed" ? "outline" : "default"} 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  onClick={() => handleExerciseClick(exercise.id)}
                >
                  {exercise.status === "completed" ? "Review" : 
                   exercise.status === "in-progress" ? "Continue" : 
                   exercise.status === "new" ? "Start" : "Begin"} 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <StressAssessmentDialog
        isOpen={isStressDialogOpen}
        onClose={() => setIsStressDialogOpen(false)}
        onComplete={() => {
          setIsStressDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your stress assessment has been saved successfully.",
          });
        }}
      />
    </DashboardLayout>
  );
};

export default Exercises;
