
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/Header";
import LoadingRayMeter from '@/components/LoadingRayMeter';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PreloaderDemo = () => {
  const [progress, setProgress] = useState<number>(0);
  const [autoAnimate, setAutoAnimate] = useState(true);
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [showPercentage, setShowPercentage] = useState(false);
  
  // Manual progress control
  const handleSliderChange = (value: number[]) => {
    setProgress(value[0]);
    if (autoAnimate) setAutoAnimate(false);
  };
  
  // Reset demo
  const resetDemo = () => {
    setProgress(0);
    setAutoAnimate(true);
  };
  
  // Demo automatic animation
  useEffect(() => {
    if (!autoAnimate) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [autoAnimate]);
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-20 px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight">Loading Ray Meter Demo</h1>
          </div>
          
          <div className="bg-background/50 backdrop-blur-sm shadow-sm border rounded-xl p-8 mb-8">
            <div className="flex flex-col items-center justify-center gap-8 mb-8">
              <LoadingRayMeter 
                progress={progress}
                size={selectedSize}
                autoAnimate={autoAnimate}
                showPercentage={showPercentage}
                onComplete={() => console.log('Loading complete!')}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Progress Control</h3>
                <div className="flex items-center gap-4 mb-4">
                  <Slider
                    value={[progress]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleSliderChange}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12 text-right">{Math.round(progress)}%</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-medium">Options</h3>
                <div className="space-y-3">
                  <Button 
                    variant={autoAnimate ? "default" : "outline"}
                    onClick={() => setAutoAnimate(true)}
                    className="w-full justify-start"
                  >
                    Auto Animate
                  </Button>
                  
                  <Button 
                    variant={!autoAnimate ? "default" : "outline"}
                    onClick={() => setAutoAnimate(false)}
                    className="w-full justify-start"
                  >
                    Manual Control
                  </Button>
                  
                  <Button 
                    variant={showPercentage ? "default" : "outline"}
                    onClick={() => setShowPercentage(!showPercentage)}
                    className="w-full justify-start"
                  >
                    {showPercentage ? "Hide Percentage" : "Show Percentage"}
                  </Button>
                </div>
              </div>
              
              <Button onClick={resetDemo} className="w-full">
                Reset Demo
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Size Options</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant={selectedSize === 'sm' ? "default" : "outline"}
                    onClick={() => setSelectedSize('sm')}
                    className="w-full justify-start"
                  >
                    Small
                  </Button>
                  
                  <Button 
                    variant={selectedSize === 'md' ? "default" : "outline"}
                    onClick={() => setSelectedSize('md')}
                    className="w-full justify-start"
                  >
                    Medium
                  </Button>
                  
                  <Button 
                    variant={selectedSize === 'lg' ? "default" : "outline"}
                    onClick={() => setSelectedSize('lg')}
                    className="w-full justify-start"
                  >
                    Large
                  </Button>
                  
                  <Button 
                    variant={selectedSize === 'xl' ? "default" : "outline"}
                    onClick={() => setSelectedSize('xl')}
                    className="w-full justify-start"
                  >
                    Extra Large
                  </Button>
                </div>
              </div>
              
              <div className="bg-secondary/10 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">How to Use</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Import the LoadingRayMeter component and use it in your application:
                </p>
                <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
                  {`import LoadingRayMeter from '@/components/LoadingRayMeter';

// Basic usage
<LoadingRayMeter />

// With options
<LoadingRayMeter
  progress={75}
  size="lg"
  autoAnimate={false}
  showPercentage={true}
  onComplete={() => console.log('Done!')}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PreloaderDemo;
