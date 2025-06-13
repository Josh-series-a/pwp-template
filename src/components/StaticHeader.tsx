
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import CreditsDisplay from '@/components/CreditsDisplay';
import { CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaticHeader = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    return null;
  }
  
  const handleBuyCredits = () => {
    navigate('/account');
  };

  return (
    <div className="fixed top-0 right-0 z-40 h-16 bg-background border-b border-border flex items-center justify-end px-6 gap-4" 
         style={{ left: 'var(--sidebar-width, 0px)' }}>
      <CreditsDisplay />
      <Button 
        onClick={handleBuyCredits}
        size="sm"
        className="gap-2"
      >
        <CreditCard className="h-4 w-4" />
        Buy Credits
      </Button>
    </div>
  );
};

export default StaticHeader;
