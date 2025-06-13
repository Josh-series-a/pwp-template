
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useCredits } from '@/hooks/useCredits';
import { useSubscription } from '@/hooks/useSubscription';
import { CreditCard, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Mock data for credit consumption over time
const mockCreditData = [
  { date: '2025-01-01', credits: 120 },
  { date: '2025-01-03', credits: 115 },
  { date: '2025-01-05', credits: 108 },
  { date: '2025-01-07', credits: 102 },
  { date: '2025-01-09', credits: 95 },
  { date: '2025-01-11', credits: 88 },
  { date: '2025-01-13', credits: 80 },
];

const chartConfig = {
  credits: {
    label: "Credits",
    color: "hsl(var(--primary))",
  },
};

const CreditsChart = () => {
  const { credits } = useCredits();
  const { subscriptionInfo } = useSubscription();
  
  // Get subscription tier to determine max credits
  const getMaxCredits = (tier: string | null) => {
    switch (tier?.toLowerCase()) {
      case 'starter':
        return 18;
      case 'growth':
        return 25;
      case 'impact':
        return 55;
      default:
        return 120; // Default fallback
    }
  };

  const maxCredits = getMaxCredits(subscriptionInfo.subscription_tier);
  const currentCredits = credits?.credits || 0;
  const usagePercentage = maxCredits > 0 ? Math.round((currentCredits / maxCredits) * 100) : 0;
  
  // Calculate next reset date (example: 30 days from subscription start or monthly)
  const getNextResetDate = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 18); // 18th of next month
    return nextMonth.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const handleBuyExtraCredits = () => {
    // TODO: Implement extra credits purchase
    console.log('Buy extra credits clicked');
  };

  return (
    <div className="space-y-6">
      {/* Credits Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Credits Consumption
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={mockCreditData}>
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [`${value} credits`, 'Credits Remaining']}
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              />
              <Line 
                type="monotone" 
                dataKey="credits" 
                stroke="var(--color-credits)" 
                strokeWidth={3}
                dot={{ fill: "var(--color-credits)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "var(--color-credits)", strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Current Credits Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Credits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">
              {currentCredits}/{maxCredits} credits
            </span>
            <span className="text-sm text-muted-foreground">
              {usagePercentage}% used
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Usage reset</span>
              <span className="font-medium">{getNextResetDate()}</span>
            </div>
            
            <Button 
              onClick={handleBuyExtraCredits}
              className="w-full"
              variant="outline"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Buy Extra Credits
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditsChart;
