
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import CreditsDisplay from './CreditsDisplay';

const StaticHeader: React.FC = () => {
  const handleBuyCredits = () => {
    // TODO: Implement buy credits functionality
    console.log('Buy credits clicked');
  };

  return (
    <header className="fixed top-0 right-0 left-20 z-40 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border flex items-center justify-end px-6 group-data-[state=expanded]:left-64 transition-all duration-200">
      <div className="flex items-center gap-4">
        <CreditsDisplay />
        <Button onClick={handleBuyCredits} variant="outline" size="sm" className="gap-2">
          <CreditCard className="h-4 w-4" />
          Buy Credits
        </Button>
      </div>
    </header>
  );
};

export default StaticHeader;
