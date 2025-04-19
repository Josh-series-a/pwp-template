
import React from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  isAnimating: boolean;
  direction: 'next' | 'prev';
}

const PageTransition = ({ children, isAnimating, direction }: PageTransitionProps) => {
  return (
    <div
      className={cn(
        "relative transition-transform duration-700 ease-in-out",
        isAnimating && direction === 'next' && "animate-page-turn",
        isAnimating && direction === 'prev' && "animate-page-turn-reverse"
      )}
    >
      {children}
    </div>
  );
};

export default PageTransition;
