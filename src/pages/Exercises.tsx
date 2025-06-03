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
  Star,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useCredits } from '@/hooks/useCredits';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import RunAnalysisModal from '@/components/reports/RunAnalysisModal';
import StressAssessmentDialog from '@/components/exercises/StressAssessmentDialog';
import MissionStatementDialog from '@/components/exercises/MissionStatementDialog';
import FutureBackPlanningDialog from '@/components/exercises/FutureBackPlanningDialog';
import ExitStrategyDialog from '@/components/exercises/ExitStrategyDialog';
import EnvironmentalSocialDialog from '@/components/exercises/EnvironmentalSocialDialog';
import KnowYourCustomerDialog from '@/components/exercises/KnowYourCustomerDialog';
import OneOnOnePropositionDialog from '@/components/exercises/OneOnOnePropositionDialog';
import ReachCustomersDialog from '@/components/exercises/ReachCustomersDialog';
import GeographicReachDialog from '@/components/exercises/GeographicReachDialog';
import FutureBusinessModelDialog from '@/components/exercises/FutureBusinessModelDialog';
import SWOTAnalysisDialog from '@/components/exercises/SWOTAnalysisDialog';
import NetworkingOpportunitiesDialog from '@/components/exercises/NetworkingOpportunitiesDialog';
import AssessNetworkingDialog from '@/components/exercises/AssessNetworkingDialog';
import ValuesDialog from '@/components/exercises/ValuesDialog';
import RightPeopleDialog from '@/components/exercises/RightPeopleDialog';
import RecruitRetainDialog from '@/components/exercises/RecruitRetainDialog';

const Exercises = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { subscriptionInfo, isLoading: subscriptionLoading } = useSubscription();
  const { credits, isLoading: creditsLoading, checkCredits } = useCredits();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 9;
  const [isStressDialogOpen, setIsStressDialogOpen] = useState(false);
  const [isMissionDialogOpen, setIsMissionDialogOpen] = useState(false);
  const [isFutureBackDialogOpen, setIsFutureBackDialogOpen] = useState(false);
  const [isExitStrategyDialogOpen, setIsExitStrategyDialogOpen] = useState(false);
  const [isEnvironmentalSocialDialogOpen, setIsEnvironmentalSocialDialogOpen] = useState(false);
  const [isKnowYourCustomerDialogOpen, setIsKnowYourCustomerDialogOpen] = useState(false);
  const [isOneOnOnePropositionDialogOpen, setIsOneOnOnePropositionDialogOpen] = useState(false);
  const [isReachCustomersDialogOpen, setIsReachCustomersDialogOpen] = useState(false);
  const [isGeographicReachDialogOpen, setIsGeographicReachDialogOpen] = useState(false);
  const [isFutureBusinessModelDialogOpen, setIsFutureBusinessModelDialogOpen] = useState(false);
  const [isSWOTAnalysisDialogOpen, setIsSWOTAnalysisDialogOpen] = useState(false);
  const [isNetworkingOpportunitiesDialogOpen, setIsNetworkingOpportunitiesDialogOpen] = useState(false);
  const [isAssessNetworkingDialogOpen, setIsAssessNetworkingDialogOpen] = useState(false);
  const [isValuesDialogOpen, setIsValuesDialogOpen] = useState(false);
  const [isRightPeopleDialogOpen, setIsRightPeopleDialogOpen] = useState(false);
  const [isRecruitRetainDialogOpen, setIsRecruitRetainDialogOpen] = useState(false);
  const [isRunAnalysisModalOpen, setIsRunAnalysisModalOpen] = useState(false);

  const isSubscribed = subscriptionInfo.subscribed;
  const hasEnoughCreditsForNewCompany = checkCredits(10);

  // Enhanced exercises data with the new recruit and retain exercise
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
      title: "Create a Mission Statement", 
      progress: 60, 
      status: "in-progress",
      intro: "This exercise helps align your business with a clear, motivating direction — essential for making sound decisions, attracting the right customers and staff, and staying focused.",
      category: "planning",
      sections: 3,
      completedSections: 2,
      tags: ["planning"],
      priority: "high",
      estimatedTime: "15 min"
    },
    { 
      id: 3, 
      title: "Use Future-Back Planning", 
      progress: 0, 
      status: "new",
      intro: "Envision your ideal future and work backwards step by step to figure out how to get there. Powerful for setting strategy and avoiding reactive thinking.",
      category: "planning",
      sections: 6,
      completedSections: 0,
      tags: ["planning", "strategy"],
      priority: "high",
      estimatedTime: "25 min"
    },
    { 
      id: 4, 
      title: "Define Your Exit Strategy", 
      progress: 0, 
      status: "new",
      intro: "Many business owners avoid thinking about the end — but knowing how you want to exit your business brings clarity, motivation, and better day-to-day decisions.",
      category: "planning",
      sections: 5,
      completedSections: 0,
      tags: ["planning", "strategy"],
      priority: "high",
      estimatedTime: "20 min"
    },
    { 
      id: 5, 
      title: "Environmental and Social Impact Self-Assessment", 
      progress: 0, 
      status: "new",
      intro: "Evaluate how your business is currently engaging with environmental and social responsibility — a key part of being future-fit and resilient.",
      category: "planning",
      sections: 5,
      completedSections: 0,
      tags: ["planning", "sustainability"],
      priority: "medium",
      estimatedTime: "10 min"
    },
    { 
      id: 6, 
      title: "Know Your Customer", 
      progress: 0, 
      status: "new",
      intro: "If you try to sell to everyone, you end up selling to no one. This exercise helps you identify who your ideal customer really is — so you can focus your time, energy, and money where it counts.",
      category: "planning",
      sections: 5,
      completedSections: 0,
      tags: ["planning", "customers"],
      priority: "high",
      estimatedTime: "20 min"
    },
    { 
      id: 7, 
      title: "Create Your '1+1' Proposition", 
      progress: 0, 
      status: "new",
      intro: "A '1+1 Proposition' is what makes you stand out. It's the special combination of two things that makes your business uniquely valuable — and hard to copy.",
      category: "planning",
      sections: 4,
      completedSections: 0,
      tags: ["planning", "strategy"],
      priority: "high",
      estimatedTime: "15 min"
    },
    { 
      id: 8, 
      title: "How to Reach Your Customers", 
      progress: 0, 
      status: "new",
      intro: "Knowing who your customer is isn't enough — you also need a strategy for how to reach them. This exercise helps you define your communication and sales channels.",
      category: "planning",
      sections: 5,
      completedSections: 0,
      tags: ["planning", "customers"],
      priority: "high",
      estimatedTime: "20 min"
    },
    { 
      id: 9, 
      title: "Define Your Geographic Reach", 
      progress: 0, 
      status: "new",
      intro: "This exercise sharpens your focus by identifying where you operate best. Knowing your true geographic market saves time, effort, and money — and helps you scale intentionally.",
      category: "planning",
      sections: 5,
      completedSections: 0,
      tags: ["planning", "expansion"],
      priority: "high",
      estimatedTime: "15 min"
    },
    { 
      id: 10, 
      title: "Complete Your Future-Fit Business Model Canvas", 
      progress: 0, 
      status: "new",
      intro: "This adapted canvas helps you think holistically about your business — not just how it makes money, but also its impact on people and planet. It's a one-page strategy snapshot.",
      category: "planning",
      sections: 10,
      completedSections: 0,
      tags: ["planning", "strategy"],
      priority: "high",
      estimatedTime: "30 min"
    },
    { 
      id: 11, 
      title: "Prepare Your SWOT Analysis", 
      progress: 0, 
      status: "new",
      intro: "A well-done SWOT helps you face reality clearly — building on your strengths, addressing weaknesses, seizing opportunities, and preparing for threats.",
      category: "planning",
      sections: 4,
      completedSections: 0,
      tags: ["planning", "strategy"],
      priority: "high",
      estimatedTime: "20 min"
    },
    { 
      id: 12, 
      title: "List Your Networking Opportunities", 
      progress: 0, 
      status: "new",
      intro: "Business growth is often about who you know. This exercise helps you map out where you can meet valuable contacts — partners, customers, suppliers, or mentors.",
      category: "planning",
      sections: 5,
      completedSections: 0,
      tags: ["planning", "networking"],
      priority: "high",
      estimatedTime: "15 min"
    },
    { 
      id: 13, 
      title: "Assess Your Networking", 
      progress: 0, 
      status: "new",
      intro: "Now that you've mapped out your networking opportunities, this exercise helps you evaluate how effective your current efforts are — and where to improve.",
      category: "planning",
      sections: 5,
      completedSections: 0,
      tags: ["planning", "networking"],
      priority: "high",
      estimatedTime: "10 min"
    },
    { 
      id: 14, 
      title: "Think About Your Values", 
      progress: 0, 
      status: "new",
      intro: "Your business values shape culture, attract the right team, and guide decision-making — especially when things get tough. This exercise helps you clarify and articulate them.",
      category: "people",
      sections: 5,
      completedSections: 0,
      tags: ["people", "culture"],
      priority: "high",
      estimatedTime: "20 min"
    },
    { 
      id: 15, 
      title: "Are the Right People in the Right Seats?", 
      progress: 0, 
      status: "new",
      intro: "This exercise helps you assess whether your team members are playing to their strengths — a key part of reducing stress and building a high-performance business.",
      category: "people",
      sections: 6,
      completedSections: 0,
      tags: ["people", "leadership"],
      priority: "high",
      estimatedTime: "25 min"
    },
    { 
      id: 16, 
      title: "How Do You Recruit and Retain Staff?", 
      progress: 0, 
      status: "new",
      intro: "The right people make or break your business. This exercise helps you review how you find, choose, and keep great team members — especially those aligned with your values.",
      category: "people",
      sections: 5,
      completedSections: 0,
      tags: ["people", "recruitment"],
      priority: "high",
      estimatedTime: "20 min"
    },
    { 
      id: 17, 
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
      id: 18, 
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
      id: 19, 
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
      id: 20, 
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

  // Check if exercise is accessible
  const isExerciseAccessible = (exerciseId: number) => {
    return exerciseId === 1 || isSubscribed;
  };

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);
  const startIndex = (currentPage - 1) * exercisesPerPage;
  const endIndex = startIndex + exercisesPerPage;
  const currentExercises = filteredExercises.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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
    if (!isExerciseAccessible(exerciseId)) {
      toast({
        title: "Exercise Locked",
        description: "Subscribe to access this exercise. Exercise 1 is available for free!",
        variant: "destructive"
      });
      return;
    }

    if (exerciseId === 1) {
      setIsStressDialogOpen(true);
    } else if (exerciseId === 2) {
      setIsMissionDialogOpen(true);
    } else if (exerciseId === 3) {
      setIsFutureBackDialogOpen(true);
    } else if (exerciseId === 4) {
      setIsExitStrategyDialogOpen(true);
    } else if (exerciseId === 5) {
      setIsEnvironmentalSocialDialogOpen(true);
    } else if (exerciseId === 6) {
      setIsKnowYourCustomerDialogOpen(true);
    } else if (exerciseId === 7) {
      setIsOneOnOnePropositionDialogOpen(true);
    } else if (exerciseId === 8) {
      setIsReachCustomersDialogOpen(true);
    } else if (exerciseId === 9) {
      setIsGeographicReachDialogOpen(true);
    } else if (exerciseId === 10) {
      setIsFutureBusinessModelDialogOpen(true);
    } else if (exerciseId === 11) {
      setIsSWOTAnalysisDialogOpen(true);
    } else if (exerciseId === 12) {
      setIsNetworkingOpportunitiesDialogOpen(true);
    } else if (exerciseId === 13) {
      setIsAssessNetworkingDialogOpen(true);
    } else if (exerciseId === 14) {
      setIsValuesDialogOpen(true);
    } else if (exerciseId === 15) {
      setIsRightPeopleDialogOpen(true);
    } else if (exerciseId === 16) {
      setIsRecruitRetainDialogOpen(true);
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

  const handleRunAnalysisComplete = (companyName: string, exerciseTitle: string, pitchDeckUrl?: string, type?: string, companyId?: string) => {
    setIsRunAnalysisModalOpen(false);
    toast({
      title: "Analysis Started",
      description: `Business health check for ${companyName} is now in progress.`,
    });
  };

  const handleNewCompanyClick = () => {
    if (!hasEnoughCreditsForNewCompany) {
      toast({
        title: "Insufficient Credits",
        description: `You need 10 credits to run a Business Health Score analysis. You currently have ${credits?.credits || 0} credits.`,
        variant: "destructive"
      });
      return;
    }
    setIsRunAnalysisModalOpen(true);
  };

  return (
    <DashboardLayout title={selectedCompany ? `${selectedCompany} Exercises` : "Exercises"}>
      {/* Hero Section */}
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
                {!isSubscribed && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                    <Lock className="h-4 w-4" />
                    <span>Exercise 1 Free - Subscribe for All</span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Business Development Exercises
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Interactive worksheets pulled from the book, powered by AI. Complete these exercises to gain valuable insights into your business and leadership approach.
                {!isSubscribed && " Exercise 1 is free - subscribe to unlock all exercises."}
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
            <Button 
              onClick={handleNewCompanyClick}
              disabled={!hasEnoughCreditsForNewCompany || creditsLoading}
              className={!hasEnoughCreditsForNewCompany ? "opacity-50 cursor-not-allowed" : ""}
            >
              {!hasEnoughCreditsForNewCompany && <Lock className="mr-2 h-4 w-4" />}
              <Plus className="mr-2 h-4 w-4" />
              New Company
              {!hasEnoughCreditsForNewCompany && (
                <span className="ml-2 text-xs">(10 credits required)</span>
              )}
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
          {currentExercises.map((exercise) => {
            const isAccessible = isExerciseAccessible(exercise.id);
            
            return (
              <Card key={exercise.id} className={`group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${isAccessible ? 'bg-white' : 'bg-gray-50'}`}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(exercise.category)}
                      {getPriorityBadge(exercise.priority)}
                      {!isAccessible && <Lock className="h-4 w-4 text-gray-400" />}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(exercise.status)}
                      <span className={`text-xs ${isAccessible ? 'text-gray-500' : 'text-gray-400'}`}>
                        {exercise.estimatedTime}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <CardTitle className={`text-lg mb-2 transition-colors leading-tight ${
                      isAccessible ? 'group-hover:text-primary' : 'text-gray-500'
                    }`}>
                      {exercise.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      <span className="font-medium">Exercise {exercise.id}</span> • {exercise.category}
                      {!isAccessible && " • Subscription Required"}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className={`text-sm leading-relaxed ${isAccessible ? 'text-gray-600' : 'text-gray-500'}`}>
                    {isAccessible ? exercise.intro : "This exercise is only available to subscribers. Subscribe to unlock all exercises and get full access to the content."}
                  </p>
                  
                  {exercise.progress > 0 && isAccessible && (
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
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          isAccessible ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button 
                    variant={exercise.status === "completed" ? "outline" : "default"} 
                    className={`w-full transition-colors ${
                      isAccessible 
                        ? 'group-hover:bg-primary group-hover:text-white' 
                        : 'bg-gray-300 text-gray-500 hover:bg-gray-300 hover:text-gray-500'
                    }`}
                    onClick={() => handleExerciseClick(exercise.id)}
                    disabled={!isAccessible}
                  >
                    {!isAccessible ? (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Subscribe to Access
                      </>
                    ) : (
                      <>
                        {exercise.status === "completed" ? "Review" : 
                         exercise.status === "in-progress" ? "Continue" : 
                         exercise.status === "new" ? "Start" : "Begin"} 
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Results info */}
        <div className="text-center text-sm text-gray-500">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredExercises.length)} of {filteredExercises.length} exercises
          {!isSubscribed && " • Only Exercise 1 is accessible without subscription"}
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

      <MissionStatementDialog
        isOpen={isMissionDialogOpen}
        onClose={() => setIsMissionDialogOpen(false)}
        onComplete={() => {
          setIsMissionDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your mission statement has been saved successfully.",
          });
        }}
      />

      <FutureBackPlanningDialog
        isOpen={isFutureBackDialogOpen}
        onClose={() => setIsFutureBackDialogOpen(false)}
        onComplete={() => {
          setIsFutureBackDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your future-back planning roadmap has been saved successfully.",
          });
        }}
      />

      <ExitStrategyDialog
        isOpen={isExitStrategyDialogOpen}
        onClose={() => setIsExitStrategyDialogOpen(false)}
        onComplete={() => {
          setIsExitStrategyDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your exit strategy has been saved successfully.",
          });
        }}
      />

      <EnvironmentalSocialDialog
        isOpen={isEnvironmentalSocialDialogOpen}
        onClose={() => setIsEnvironmentalSocialDialogOpen(false)}
        onComplete={() => {
          setIsEnvironmentalSocialDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your environmental and social impact assessment has been saved successfully.",
          });
        }}
      />

      <KnowYourCustomerDialog
        isOpen={isKnowYourCustomerDialogOpen}
        onClose={() => setIsKnowYourCustomerDialogOpen(false)}
        onComplete={() => {
          setIsKnowYourCustomerDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your customer analysis has been saved successfully.",
          });
        }}
      />

      <OneOnOnePropositionDialog
        isOpen={isOneOnOnePropositionDialogOpen}
        onClose={() => setIsOneOnOnePropositionDialogOpen(false)}
        onComplete={() => {
          setIsOneOnOnePropositionDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your 1+1 proposition has been saved successfully.",
          });
        }}
      />

      <ReachCustomersDialog
        isOpen={isReachCustomersDialogOpen}
        onClose={() => setIsReachCustomersDialogOpen(false)}
        onComplete={() => {
          setIsReachCustomersDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your customer reach strategy has been saved successfully.",
          });
        }}
      />
      
      <GeographicReachDialog
        isOpen={isGeographicReachDialogOpen}
        onClose={() => setIsGeographicReachDialogOpen(false)}
        onComplete={() => {
          setIsGeographicReachDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your geographic reach analysis has been saved successfully.",
          });
        }}
      />

      <FutureBusinessModelDialog
        isOpen={isFutureBusinessModelDialogOpen}
        onClose={() => setIsFutureBusinessModelDialogOpen(false)}
        onComplete={() => {
          setIsFutureBusinessModelDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your business model canvas has been saved successfully.",
          });
        }}
      />

      <SWOTAnalysisDialog
        isOpen={isSWOTAnalysisDialogOpen}
        onClose={() => setIsSWOTAnalysisDialogOpen(false)}
        onComplete={() => {
          setIsSWOTAnalysisDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your SWOT analysis has been saved successfully.",
          });
        }}
      />

      <NetworkingOpportunitiesDialog
        isOpen={isNetworkingOpportunitiesDialogOpen}
        onClose={() => setIsNetworkingOpportunitiesDialogOpen(false)}
        onComplete={() => {
          setIsNetworkingOpportunitiesDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your networking opportunities plan has been saved successfully.",
          });
        }}
      />

      <AssessNetworkingDialog
        isOpen={isAssessNetworkingDialogOpen}
        onClose={() => setIsAssessNetworkingDialogOpen(false)}
        onComplete={() => {
          setIsAssessNetworkingDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your networking assessment has been saved successfully.",
          });
        }}
      />

      <ValuesDialog
        isOpen={isValuesDialogOpen}
        onClose={() => setIsValuesDialogOpen(false)}
        onComplete={() => {
          setIsValuesDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your business values framework has been saved successfully.",
          });
        }}
      />

      <RightPeopleDialog
        isOpen={isRightPeopleDialogOpen}
        onClose={() => setIsRightPeopleDialogOpen(false)}
        onComplete={() => {
          setIsRightPeopleDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your team assessment has been saved successfully.",
          });
        }}
      />

      <RecruitRetainDialog
        isOpen={isRecruitRetainDialogOpen}
        onClose={() => setIsRecruitRetainDialogOpen(false)}
        onComplete={() => {
          setIsRecruitRetainDialogOpen(false);
          toast({
            title: "Exercise completed!",
            description: "Your recruitment and retention assessment has been saved successfully.",
          });
        }}
      />

      <RunAnalysisModal 
        isOpen={isRunAnalysisModalOpen} 
        onClose={() => setIsRunAnalysisModalOpen(false)} 
        onSubmitComplete={handleRunAnalysisComplete} 
      />
    </DashboardLayout>
  );
};

export default Exercises;
