
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface TransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'blur';
  delay?: number;
}

const TransitionWrapper = ({
  children,
  className,
  animation = 'fade',
  delay = 0
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
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div 
      className={cn(
        getAnimationClass(),
        "transition-all duration-500 will-change-transform",
        className
      )}
      style={{ 
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default TransitionWrapper;
