
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingRayMeter from './LoadingRayMeter';
import { cn } from '@/lib/utils';

const PageLoader = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  // Reset and trigger loader on route change
  useEffect(() => {
    // Start loading
    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress for resources loading
    let startTime = Date.now();
    const duration = 1500; // 1.5 seconds minimum loading time
    const minDisplayTime = 500; // Minimum time to show loader (for better UX)
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(95, (elapsed / duration) * 100); // Cap at 95% until complete
      
      setProgress(newProgress);
      
      // If we've reached max progress
      if (newProgress >= 95) {
        clearInterval(interval);
      }
    }, 50);
    
    // Complete loading after resources are loaded
    const handleLoad = () => {
      // Ensure minimum display time has passed for smoother UX
      const timeElapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - timeElapsed);
      
      // Set progress to 100
      setProgress(100);
      
      // Hide loader after minimum display time
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    };
    
    // Listen for window load event (for initial page load)
    window.addEventListener('load', handleLoad);
    
    // For navigation between routes, use a timeout as a fallback
    const navigationTimeout = setTimeout(() => {
      handleLoad();
    }, duration);
    
    return () => {
      window.removeEventListener('load', handleLoad);
      clearInterval(interval);
      clearTimeout(navigationTimeout);
    };
  }, [location.pathname]);
  
  if (!isLoading) return null;
  
  return (
    <div 
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-md",
        "transition-opacity duration-500",
        progress === 100 ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      <div className="flex flex-col items-center">
        <LoadingRayMeter 
          progress={progress} 
          size="lg" 
          autoAnimate={false}
          showPercentage={true}
        />
        <p className="mt-6 text-lg font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
