
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart, Loader2 } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';

const HealthScoreCreditsDisplay = () => {
  const { healthScoreCredits, isLoading } = useCredits();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const currentCredits = healthScoreCredits?.health_score_credits || 0;

  return (
    <Badge variant="outline" className="gap-2 px-3 py-1">
      <Heart className="h-4 w-4 text-red-500" />
      <span className="font-medium">Health Score Credits: {currentCredits}</span>
    </Badge>
  );
};

export default HealthScoreCreditsDisplay;
