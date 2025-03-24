
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Sun } from 'lucide-react';

interface LoadingRayMeterProps {
  progress?: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg' | 'xl';
  autoAnimate?: boolean;
  className?: string;
  showPercentage?: boolean;
  onComplete?: () => void;
}

const LoadingRayMeter = ({
  progress: externalProgress,
  size = 'md',
  autoAnimate = true,
  className,
  showPercentage = false,
  onComplete
}: LoadingRayMeterProps) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Use external progress if provided, otherwise use internal animated progress
  const progress = externalProgress !== undefined ? externalProgress : internalProgress;
  
  // Auto-animate progress if enabled
  useEffect(() => {
    if (!autoAnimate || externalProgress !== undefined) return;
    
    let animationFrame: number;
    let startTime: number | null = null;
    const duration = 5000; // 5 seconds to complete
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min(100, (elapsed / duration) * 100);
      
      setInternalProgress(newProgress);
      
      if (newProgress < 100) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [autoAnimate, externalProgress, onComplete]);
  
  // Check if external progress reaches 100
  useEffect(() => {
    if (externalProgress === 100 && !isComplete) {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [externalProgress, isComplete, onComplete]);
  
  // Number of rays
  const rayCount = 12;
  
  // Size mappings
  const sizeClasses = {
    sm: {
      container: 'w-16 h-16',
      sun: 'w-6 h-6',
      rays: 'w-16 h-16',
    },
    md: {
      container: 'w-24 h-24',
      sun: 'w-8 h-8',
      rays: 'w-24 h-24',
    },
    lg: {
      container: 'w-32 h-32',
      sun: 'w-10 h-10', 
      rays: 'w-32 h-32',
    },
    xl: {
      container: 'w-40 h-40',
      sun: 'w-12 h-12',
      rays: 'w-40 h-40',
    }
  };
  
  // Calculate which rays should be active based on progress
  const activeRayCount = Math.ceil((progress / 100) * rayCount);
  
  return (
    <div 
      className={cn(
        'relative flex items-center justify-center',
        sizeClasses[size].container,
        className
      )}
    >
      {/* Rays Container */}
      <div className={cn(
        'absolute',
        sizeClasses[size].rays,
      )}>
        {Array.from({ length: rayCount }).map((_, index) => {
          const isActive = index < activeRayCount;
          const rotation = (index * (360 / rayCount));
          
          return (
            <div 
              key={index}
              className={cn(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-full origin-center',
                'transform transition-all duration-500'
              )}
              style={{ 
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              }}
            >
              <div
                className={cn(
                  'absolute top-0 left-1/2 -translate-x-1/2 h-1/3 rounded-full w-1.5',
                  'transform origin-bottom transition-all duration-500 ease-out',
                  isActive 
                    ? 'bg-secondary scale-y-100 animate-pulse-subtle' 
                    : 'bg-secondary/20 scale-y-90'
                )}
              />
            </div>
          );
        })}
      </div>
      
      {/* Sun Center */}
      <div 
        className={cn(
          'relative rounded-full bg-secondary flex items-center justify-center z-10',
          isComplete ? 'animate-pulse-subtle shadow-lg shadow-secondary/30' : '',
          sizeClasses[size].sun
        )}
      >
        <Sun 
          className={cn(
            'text-primary h-full w-full p-1',
            isComplete ? 'animate-spin' : '',
          )} 
          style={{ animationDuration: '12s' }}
        />
      </div>
      
      {/* Optional Percentage */}
      {showPercentage && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium">
          {Math.round(progress)}%
        </div>
      )}
      
      {/* Complete glow effect */}
      {isComplete && (
        <div className={cn(
          'absolute rounded-full bg-secondary/10 animate-pulse-subtle',
          sizeClasses[size].container
        )} />
      )}
    </div>
  );
};

export default LoadingRayMeter;
