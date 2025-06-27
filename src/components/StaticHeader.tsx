
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import CreditsDisplay from './CreditsDisplay';
import HealthScoreCreditsDisplay from './HealthScoreCreditsDisplay';

const StaticHeader: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  
  const handleBuyCredits = () => {
    // TODO: Implement buy credits functionality
    console.log('Buy credits clicked');
  };

  return (
    <header className="fixed top-0 right-0 left-20 z-40 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border flex items-center justify-between px-6 group-data-[state=expanded]:left-64 transition-all duration-200">
      <div className="flex items-center justify-center lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="flex items-center justify-center h-8 w-8 p-0"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-4 ml-auto">
        <CreditsDisplay />
        <HealthScoreCreditsDisplay />
        <Button onClick={handleBuyCredits} variant="outline" size="sm" className="gap-2">
          <CreditCard className="h-4 w-4" />
          Buy Credits
        </Button>
      </div>
    </header>
  );
};

export default StaticHeader;
