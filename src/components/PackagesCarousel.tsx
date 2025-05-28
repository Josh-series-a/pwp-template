
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PackagesCarouselProps {
  reportId: string;
}

const PackagesCarousel = ({ reportId }: PackagesCarouselProps) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    // Using a placeholder packageId for now - this would typically come from data
    const packageId = 'package-1';
    navigate(`/dashboard/reports/palladium/unknown/${reportId}/${packageId}`);
  };

  return (
    <div className="w-full">
      <Card 
        className="bg-gradient-to-t from-yellow-400 to-white border-yellow-300 max-w-md h-96 flex flex-col justify-end cursor-pointer hover:shadow-lg transition-shadow duration-200"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-4 pt-4">
          <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
            Plan Your Business Legacy with Confidence
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <p className="text-lg font-medium text-gray-800">
            4 Documents
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackagesCarousel;
