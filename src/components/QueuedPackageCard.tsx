import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface QueuedPackageCardProps {
  packageName: string;
  estimatedTime?: number; // in seconds, default 600 (10 minutes)
}

const QueuedPackageCard: React.FC<QueuedPackageCardProps> = ({ 
  packageName,
  estimatedTime = 600 // 10 minutes in seconds
}) => {
  const [timeRemaining, setTimeRemaining] = useState(estimatedTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative overflow-hidden rounded-xl aspect-square">
      {/* Shimmer Animation Container */}
      <div className="h-full bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 relative">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite] -skew-x-12" />
        </div>
        
        {/* Content */}
        <div className="h-full flex flex-col justify-between p-6 relative z-10">
          {/* Status Badge */}
          <div className="flex justify-start">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              In Progress
            </Badge>
          </div>

          {/* Package Info */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold leading-tight line-clamp-3 text-foreground">
              {packageName}
            </h2>
            
            {/* Timer */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-base font-medium">
                {formatTime(timeRemaining)} remaining
              </span>
            </div>
            
            {/* Progress Indicator */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ 
                  width: `${Math.max(5, ((estimatedTime - timeRemaining) / estimatedTime) * 100)}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default QueuedPackageCard;