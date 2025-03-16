
import React from 'react';
import { cn } from "@/lib/utils";
import TransitionWrapper from './TransitionWrapper';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0,
  className
}: FeatureCardProps) => {
  return (
    <TransitionWrapper animation="slide-up" delay={delay}>
      <div className={cn(
        "p-6 rounded-2xl glass-card flex flex-col items-start gap-4",
        "border border-white/20 dark:border-gray-800/30",
        "hover:shadow-md hover:scale-[1.02] smooth-transition",
        className
      )}>
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        
        <h3 className="text-xl font-medium">{title}</h3>
        
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </div>
    </TransitionWrapper>
  );
};

export default FeatureCard;
