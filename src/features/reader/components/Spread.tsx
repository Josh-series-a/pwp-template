
import React from 'react';
import { cn } from "@/lib/utils";
import PageTransition from '@/components/PageTransition';
import { useReader } from '../context/ReaderContext';
import { useTurnPage } from '../hooks/useTurnPage';
import { getPageContent } from '../reader.config';
import TransitionWrapper from '@/components/TransitionWrapper';

interface SpreadProps {
  className?: string;
}

const Spread: React.FC<SpreadProps> = ({ className }) => {
  const { 
    currentPage, 
    phase, 
    direction, 
    activeSide, 
    isSpreadView,
    completeAnimation 
  } = useReader();
  
  // Determine left and right page numbers
  const leftPage = currentPage;
  const rightPage = currentPage + 1;
  
  // For mapping our direction type to PageTransition's expected type
  const directionMap = {
    'forward': 'next',
    'backward': 'prev',
    'none': 'none'
  } as const;
  
  return (
    <div 
      className={cn(
        "flex items-stretch justify-center relative",
        phase === 'turning' && "cursor-wait",
        className
      )}
    >
      {isSpreadView ? (
        <>
          <div 
            className={cn(
              "flex-1 max-w-[600px] min-w-[600px] relative bg-[#f8f5ed] dark:bg-[#252117] p-12",
              "book-page left-page"
            )}
          >
            <PageTransition 
              isAnimating={phase === 'turning'} 
              direction={directionMap[direction]}
              activeSide={activeSide}
              onAnimationComplete={completeAnimation}
              pageNumber={leftPage}
            >
              <div className="h-full">
                {getPageContent(leftPage)}
              </div>
            </PageTransition>
          </div>
          
          <div className="book-spine w-[2px] bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600" />
          
          <div 
            className={cn(
              "flex-1 max-w-[600px] min-w-[600px] relative bg-[#f8f5ed] dark:bg-[#252117] p-12",
              "book-page right-page",
              "shadow-[inset_5px_0_15px_-5px_rgba(0,0,0,0.3)]"
            )}
          >
            <PageTransition 
              isAnimating={phase === 'turning'} 
              direction={directionMap[direction]}
              activeSide={activeSide}
              onAnimationComplete={completeAnimation}
              pageNumber={rightPage}
            >
              <div className="h-full">
                {getPageContent(rightPage)}
              </div>
            </PageTransition>
          </div>
        </>
      ) : (
        <div 
          className={cn(
            "w-full max-w-[600px] relative bg-[#f8f5ed] dark:bg-[#252117] p-12 shadow-md rounded",
            "book-page single-page"
          )}
        >
          <PageTransition 
            isAnimating={phase === 'turning'} 
            direction={directionMap[direction]}
            activeSide={activeSide}
            onAnimationComplete={completeAnimation}
            pageNumber={currentPage}
          >
            <div className="h-full">
              {getPageContent(currentPage)}
            </div>
          </PageTransition>
        </div>
      )}
    </div>
  );
};

export default Spread;
