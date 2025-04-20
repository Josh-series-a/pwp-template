
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  isAnimating: boolean;
  direction: 'next' | 'prev' | 'none';
  activeSide?: 'left' | 'right' | 'none';
  onAnimationComplete?: () => void;
  pageNumber?: number;
  totalPages?: number;
}

const PageTransition = ({ 
  children, 
  isAnimating, 
  direction,
  activeSide = 'none',
  onAnimationComplete,
  pageNumber,
  totalPages 
}: PageTransitionProps) => {
  const [content, setContent] = useState(children);
  
  useEffect(() => {
    // After the animation is complete, update the content
    if (!isAnimating) {
      setContent(children);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }
  }, [children, isAnimating, onAnimationComplete]);

  const directionMapping = {
    'next': 'forward',
    'prev': 'backward',
    'none': 'none'
  } as const;
  
  const mappedDirection = directionMapping[direction] || 'none';
  
  return (
    <div className="relative book-container perspective-800">
      <div
        className={cn(
          "relative transition-all duration-850 transform-style-3d",
          isAnimating && mappedDirection === 'forward' && activeSide === 'right' && 
            "animate-page-turn-forward origin-left",
          isAnimating && mappedDirection === 'backward' && activeSide === 'left' && 
            "animate-page-turn-backward origin-right",
          isAnimating && "pointer-events-none"
        )}
        style={{
          transitionTimingFunction: "cubic-bezier(.55,.06,.26,1.02)"
        }}
      >
        {isAnimating ? content : children}
        
        {/* Back-face tint pseudo element (via a real element) */}
        {isAnimating && (
          <div 
            className={cn(
              "absolute inset-0 bg-black/5 opacity-0",
              mappedDirection === 'forward' && "animate-backface-tint-in",
              mappedDirection === 'backward' && "animate-backface-tint-in"
            )}
          />
        )}
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
