
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  isAnimating: boolean;
  direction: 'next' | 'prev';
  pageNumber?: number;
  totalPages?: number;
  onAnimationComplete?: () => void;
}

const PageTransition = ({ 
  children, 
  isAnimating, 
  direction,
  pageNumber,
  totalPages,
  onAnimationComplete
}: PageTransitionProps) => {
  const [content, setContent] = useState(children);
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'turning' | 'complete'>('initial');
  const timeoutRef = useRef<number | null>(null);
  
  // Determine which side is active based on direction
  // When going forward (next): fold the right-hand sheet (odd page)
  // When going backward (prev): fold the left-hand sheet (even page)
  const activeSide = direction === 'next' ? 'right' : 'left';
  
  useEffect(() => {
    // After the animation is complete, update the content
    if (!isAnimating) {
      setContent(children);
      setAnimationPhase('initial');
    } else if (isAnimating && animationPhase === 'initial') {
      setAnimationPhase('turning');
      
      // Use browser animation timing to match our specified duration (850ms)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setAnimationPhase('complete');
        setContent(children);
        onAnimationComplete?.();
      }, 850); // Animation duration
    }
    
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [children, isAnimating, animationPhase, onAnimationComplete]);
  
  return (
    <div className="relative book-container perspective-800">
      <div className="relative w-full h-full flex">
        {/* Left page (even page) - this is the one that folds during "prev" direction */}
        <div 
          className={cn(
            "w-1/2 relative transition-all duration-850 book-page left-page",
            "backface-hidden",
            activeSide === 'left' && isAnimating && animationPhase === 'turning' && [
              "origin-right z-10",
              "animate-page-turn-left"
            ]
          )}
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: activeSide === 'left' && isAnimating && animationPhase === 'turning' 
              ? '0 6px 22px rgba(0,0,0,0.1)' 
              : 'none'
          }}
        >
          {/* Left page content */}
          <div className="absolute inset-0 p-8">
            {isAnimating && direction === 'prev' ? content : children}
          </div>
          
          {/* Backface tint for realism when page is turning */}
          {activeSide === 'left' && isAnimating && (
            <div className="absolute inset-0 bg-black/5 pointer-events-none backface-hidden"></div>
          )}
        </div>
        
        {/* Right page (odd page) - this is the one that folds during "next" direction */}
        <div 
          className={cn(
            "w-1/2 relative transition-all duration-850 book-page right-page",
            "backface-hidden",
            activeSide === 'right' && isAnimating && animationPhase === 'turning' && [
              "origin-left z-10",
              "animate-page-turn-right"
            ]
          )}
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: activeSide === 'right' && isAnimating && animationPhase === 'turning' 
              ? '0 6px 22px rgba(0,0,0,0.1)' 
              : 'none'
          }}
        >
          {/* Right page content */}
          <div className="absolute inset-0 p-8">
            {isAnimating && direction === 'next' ? content : children}
          </div>
          
          {/* Backface tint for realism when page is turning */}
          {activeSide === 'right' && isAnimating && (
            <div className="absolute inset-0 bg-black/5 pointer-events-none backface-hidden"></div>
          )}
        </div>
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
