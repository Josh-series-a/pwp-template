
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dumbbell, 
  Calendar, 
  Users, 
  ArrowRightCircle, 
  Clipboard,
  TrendingUp
} from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface ExerciseSelectorProps {
  onSelect: (exerciseId: string) => void;
  isNewCompany?: boolean;
}

const exercises: Exercise[] = [
  {
    id: 'business-health-score',
    title: 'Business Health Score',
    description: 'Assess your business across strategy, team, finance, impact, and leadership.',
    icon: TrendingUp
  },
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
    icon: Users
  },
  {
    id: 'exercise-7',
    title: 'Exercise 7: Create Your "1+1" Proposition',
    description: 'Identify your primary value proposition',
    icon: Clipboard
  },
  {
    id: 'exercise-18',
    title: 'Exercise 18: Measure Your Delegation',
    description: 'Assess how well you delegate in your business',
    icon: Dumbbell
  },
  {
    id: 'exercise-27',
    title: 'Exercise 27: Know Your Key Customers',
    description: 'Analyze and improve key customer relationships',
    icon: Calendar
  }
];

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ onSelect, isNewCompany = false }) => {
  return (
    <div className="space-y-4">
      {isNewCompany && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-700">
            For new companies, please complete the Business Health Score first to unlock other discovery questions.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercises.map((exercise) => {
          const isDisabled = isNewCompany && exercise.id !== 'business-health-score';
          
          return (
            <Card 
              key={exercise.id}
              className={`transition-all ${
                isDisabled 
                  ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                  : 'cursor-pointer hover:border-primary/50'
              }`}
              onClick={() => !isDisabled && onSelect(exercise.id)}
            >
              <CardContent className="p-6 flex items-start space-x-4">
                <div className={`p-2 rounded-full ${
                  isDisabled ? 'bg-gray-200' : 'bg-primary/10'
                }`}>
                  <exercise.icon className={`h-6 w-6 ${
                    isDisabled ? 'text-gray-400' : 'text-primary'
                  }`} />
                </div>
                <div>
                  <h4 className={`font-medium ${
                    isDisabled ? 'text-gray-400' : 'text-foreground'
                  }`}>
                    {exercise.title}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    isDisabled ? 'text-gray-400' : 'text-muted-foreground'
                  }`}>
                    {isDisabled ? 'Complete Business Health Score to unlock' : exercise.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ExerciseSelector;
