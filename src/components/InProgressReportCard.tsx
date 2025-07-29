import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, DownloadCloud, RefreshCw, Share2, Trash2, TrendingUp, Users, DollarSign, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Report {
  id: string;
  title: string;
  date: string;
  company: string;
  status: string;
  statusType: string;
  pitchDeckUrl?: string;
  exerciseId?: string;
  companyId?: string;
  plan?: number;
  people?: number;
  profits?: number;
  purposeImpact?: number;
  stressLeadership?: number;
  overall?: number;
}

interface InProgressReportCardProps {
  report: Report;
  onNavigate: (report: Report) => void;
  onViewModal: (reportId: string) => void;
  onDownload: (report: Report) => void;
  onReAnalyze: (report: Report) => void;
  onShare: (report: Report) => void;
  onDelete: (report: Report) => void;
}

const InProgressReportCard = ({
  report,
  onNavigate,
  onViewModal,
  onDownload,
  onReAnalyze,
  onShare,
  onDelete
}: InProgressReportCardProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress animation
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 3;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const metricProgress = Math.min(progress + Math.random() * 10, 85);

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 border-0 shadow-lg hover:scale-[1.02]",
        "bg-gradient-to-br from-card to-card/50 relative overflow-hidden"
      )}
      onClick={() => onNavigate(report)}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <CardHeader className="pb-4 space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="text-sm font-medium text-primary tracking-wide">
              Business Health Score
            </div>
            <CardTitle className="text-xl font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {report.company}
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              {new Date(report.date).toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
          </div>
          <div onClick={e => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60 hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onNavigate(report)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewModal(report.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Quick View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(report)}>
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReAnalyze(report)}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Re-analyze
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(report)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(report)} className="text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Status Tags */}
        <div className="flex gap-2">
          <Badge 
            variant={report.statusType === 'Existing' ? 'default' : 'secondary'} 
            className={`text-xs font-medium px-2.5 py-1 ${
              report.statusType === 'Existing' 
                ? 'bg-amber-100 text-amber-800 border-amber-200' 
                : 'bg-blue-100 text-blue-800 border-blue-200'
            }`}
          >
            {report.statusType}
          </Badge>
          <Badge 
            variant="outline"
            className="text-xs font-medium px-2.5 py-1 bg-amber-100 text-amber-800 border-amber-200 animate-pulse"
          >
            {report.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-6">
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Analysis Progress</span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">
            Estimated completion: {Math.max(1, Math.round((100 - progress) / 5))} minutes remaining
          </div>
        </div>
        
        {/* Metrics Grid with Progress */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Plan</span>
              </div>
              <span className="text-lg font-bold text-muted-foreground">
                {metricProgress > 20 ? `${Math.round(metricProgress)}%` : '...'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">People</span>
              </div>
              <span className="text-lg font-bold text-muted-foreground">
                {metricProgress > 40 ? `${Math.round(metricProgress - 10)}%` : '...'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Profits</span>
              </div>
              <span className="text-lg font-bold text-muted-foreground">
                {metricProgress > 60 ? `${Math.round(metricProgress - 20)}%` : '...'}
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Purpose</span>
              </div>
              <span className="text-lg font-bold text-muted-foreground">
                {metricProgress > 30 ? `${Math.round(metricProgress - 5)}%` : '...'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Stress</span>
              </div>
              <span className="text-lg font-bold text-muted-foreground">
                {metricProgress > 50 ? `${Math.round(metricProgress - 15)}%` : '...'}
              </span>
            </div>
            <div className="py-2">
              {/* Spacer */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InProgressReportCard;