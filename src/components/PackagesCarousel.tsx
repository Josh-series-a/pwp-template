
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PackagesCarousel = () => {
  return (
    <div className="w-full">
      <Card className="bg-gradient-to-t from-yellow-400 to-white border-yellow-300 max-w-md h-96 flex flex-col justify-end">
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
