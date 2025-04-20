
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { TOTAL_PAGES, getChapterForPage } from '../reader.config';

type PhaseType = 'idle' | 'turning';
type DirectionType = 'none' | 'forward' | 'backward';
type ActiveSideType = 'left' | 'right' | 'none';

interface ReaderContextType {
  currentPage: number;
  targetPage: number;
  phase: PhaseType;
  direction: DirectionType;
  activeSide: ActiveSideType;
  isSpreadView: boolean;
  setCurrentPage: (page: number) => void;
  turnPage: (targetPage: number) => void;
  completeAnimation: () => void;
  toggleSpreadView: () => void;
}

const ReaderContext = createContext<ReaderContextType | null>(null);

export const useReader = () => {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReader must be used within a ReaderProvider');
  }
  return context;
};

interface ReaderProviderProps {
  children: ReactNode;
  initialPage?: number;
}

export const ReaderProvider: React.FC<ReaderProviderProps> = ({ 
  children, 
  initialPage = 1 
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [targetPage, setTargetPage] = useState(initialPage);
  const [phase, setPhase] = useState<PhaseType>('idle');
  const [direction, setDirection] = useState<DirectionType>('none');
  const [activeSide, setActiveSide] = useState<ActiveSideType>('none');
  const [isSpreadView, setIsSpreadView] = useState(true);

  // Function to initiate page turning
  const turnPage = useCallback((newTargetPage: number) => {
    if (phase === 'turning') return; // Prevent turning while already in animation
    
    // Clamp target page within valid range
    const clampedTarget = Math.max(1, Math.min(newTargetPage, TOTAL_PAGES));
    
    // Don't proceed if target is current page
    if (clampedTarget === currentPage) return;
    
    // Determine direction
    const newDirection = clampedTarget > currentPage ? 'forward' : 'backward';
    
    // Determine which side is active
    const newActiveSide = newDirection === 'forward' ? 'right' : 'left';
    
    // Set all states
    setTargetPage(clampedTarget);
    setDirection(newDirection);
    setActiveSide(newActiveSide);
    setPhase('turning');
  }, [currentPage, phase]);

  // Function to call when animation completes
  const completeAnimation = useCallback(() => {
    if (phase === 'turning') {
      setCurrentPage(targetPage);
      setPhase('idle');
      setDirection('none');
      setActiveSide('none');
    }
  }, [phase, targetPage]);

  // Toggle between spread and single page view
  const toggleSpreadView = useCallback(() => {
    setIsSpreadView(prev => !prev);
  }, []);

  return (
    <ReaderContext.Provider value={{
      currentPage,
      targetPage,
      phase,
      direction,
      activeSide,
      isSpreadView,
      setCurrentPage,
      turnPage,
      completeAnimation,
      toggleSpreadView
    }}>
      {children}
    </ReaderContext.Provider>
  );
};

export default ReaderContext;
