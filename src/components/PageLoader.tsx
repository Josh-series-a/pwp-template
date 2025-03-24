
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingRayMeter from '@/components/LoadingRayMeter';

interface PageLoaderProps {
  minLoadTime?: number; // Minimum time to show loader (ms)
}

const PageLoader: React.FC<PageLoaderProps> = ({ minLoadTime = 800 }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  // Reset loader on route change
  useEffect(() => {
    setLoading(true);
    setProgress(0);
    
    const startTime = Date.now();
    
    // Start progress animation
    let animationFrame: number;
    let startAnimTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startAnimTime) startAnimTime = timestamp;
      const elapsed = timestamp - startAnimTime;
      
      // Calculate progress, using a curve that speeds up as it goes
      // Aim to reach ~85% quickly, then slow down (letting page load finish it)
      const newProgress = Math.min(85, Math.sqrt(elapsed / 10) * 8);
      
      setProgress(newProgress);
      
      if (newProgress < 85) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    // Check if all elements and images are loaded
    const finishLoading = () => {
      // Calculate time spent loading so far
      const timeSpent = Date.now() - startTime;
      
      // If we haven't met the minimum load time, wait until we do
      if (timeSpent < minLoadTime) {
        setTimeout(() => {
          setProgress(100);
          setTimeout(() => setLoading(false), 300); // Short delay after reaching 100%
        }, minLoadTime - timeSpent);
      } else {
        setProgress(100);
        setTimeout(() => setLoading(false), 300); // Short delay after reaching 100%
      }
    };
    
    // Wait for page to fully load
    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      window.addEventListener('load', finishLoading);
    }
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener('load', finishLoading);
    };
  }, [location.pathname, minLoadTime]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-[9999] transition-opacity duration-300">
      <div className="flex flex-col items-center">
        <LoadingRayMeter 
          progress={progress} 
          size="lg" 
          autoAnimate={false} 
          showPercentage={true} 
        />
        <p className="mt-6 text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
