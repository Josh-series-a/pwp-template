
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  isAnimating: boolean;
  direction: 'next' | 'prev';
  pageNumber?: number;
  totalPages?: number;
}

const PageTransition = ({ 
  children, 
  isAnimating, 
  direction,
  pageNumber,
  totalPages 
}: PageTransitionProps) => {
  const [content, setContent] = useState(children);
  
  useEffect(() => {
    // After the animation is complete, update the content
    if (!isAnimating) {
      setContent(children);
    }
  }, [children, isAnimating]);
  
  return (
    <div className="relative book-container perspective-1000">
      <div
        className={cn(
          "relative transition-all duration-700 ease-in-out transform-style-3d",
          isAnimating && direction === 'next' && "animate-page-turn",
          isAnimating && direction === 'prev' && "animate-page-turn-reverse"
        )}
      >
        {isAnimating ? content : children}
      </div>
      {pageNumber && totalPages && (
        <div className="absolute bottom-4 left-0 right-0 text-center font-serif text-sm text-muted-foreground">
          Page {pageNumber} of {totalPages}
        </div>
      )}
    </div>
  );
};

export default PageTransition;
