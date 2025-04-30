
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dumbbell, 
  Calendar, 
  Users, 
  ArrowRightCircle, 
  Clipboard 
} from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  disabled?: boolean;
}

interface ExerciseSelectorProps {
  onSelect: (exerciseId: string) => void;
}

const exercises: Exercise[] = [
  {
    id: 'exercise-4',
    title: 'Exercise 4: Define Your Exit Strategy',
    description: 'Plan how and when you\'ll exit your business',
    icon: ArrowRightCircle
  },
  {
    id: 'exercise-6',
    title: 'Exercise 6: Know Your Customer',
    description: 'Define your ideal customer profile',
    icon: Users,
    disabled: true
  },
  {
    id: 'exercise-7',
    title: 'Exercise 7: Create Your "1+1" Proposition',
    description: 'Identify your primary value proposition',
    icon: Clipboard,
    disabled: true
  },
  {
    id: 'exercise-18',
    title: 'Exercise 18: Measure Your Delegation',
    description: 'Assess how well you delegate in your business',
    icon: Dumbbell,
    disabled: true
  },
  {
    id: 'exercise-27',
    title: 'Exercise 27: Know Your Key Customers',
    description: 'Analyze and improve key customer relationships',
    icon: Calendar,
    disabled: true
  }
];

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {exercises.map((exercise) => (
        <Card 
          key={exercise.id}
          className={`${exercise.disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:border-primary/50 transition-all'}`}
          onClick={() => !exercise.disabled && onSelect(exercise.id)}
        >
          <CardContent className="p-6 flex items-start space-x-4">
            <div className={`${exercise.disabled ? 'bg-muted' : 'bg-primary/10'} p-2 rounded-full`}>
              <exercise.icon className={`h-6 w-6 ${exercise.disabled ? 'text-muted-foreground' : 'text-primary'}`} />
            </div>
            <div>
              <h4 className="font-medium">{exercise.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {exercise.description}
                {exercise.disabled && <span className="block text-xs text-muted-foreground mt-1 italic">(Coming soon)</span>}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExerciseSelector;
