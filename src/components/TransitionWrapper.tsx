
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface TransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'blur' | 'slide-right' | 'slide-left' | 'page-turn';
  delay?: number;
  direction?: 'next' | 'prev';
  activeSide?: 'left' | 'right';
}

const TransitionWrapper = ({
  children,
  className,
  animation = 'fade',
  delay = 0,
  direction,
  activeSide
}: TransitionWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0';
    
    switch(animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide-up':
        return 'animate-slide-up';
      case 'slide-down':
        return 'animate-slide-down';
      case 'blur':
        return 'animate-blur-in';
      case 'slide-right':
        return 'animate-slide-right';
      case 'slide-left':
        return 'animate-slide-left';
      case 'page-turn':
        return direction === 'next' ? 'animate-page-turn-right' : 'animate-page-turn-left';
      default:
        return 'animate-fade-in';
    }
  };

  // Add mask-image for a realistic bend effect when using page-turn animation
  const getMaskStyle = () => {
    if (animation === 'page-turn') {
      const maskPosition = activeSide === 'left' ? 'right center' : 'left center';
      return {
        maskImage: 'radial-gradient(circle at ' + maskPosition + ', transparent 70%, black)',
        WebkitMaskImage: 'radial-gradient(circle at ' + maskPosition + ', transparent 70%, black)'
      };
    }
    return {};
  };

  return (
    <div 
      className={cn(
        getAnimationClass(),
        "transition-all duration-500 will-change-transform",
        animation === 'page-turn' && activeSide === 'left' && "origin-right",
        animation === 'page-turn' && activeSide === 'right' && "origin-left",
        className
      )}
      style={{ 
        transitionDelay: `${delay}ms`,
        ...getMaskStyle()
      }}
    >
      {children}
    </div>
  );
};

export default TransitionWrapper;
