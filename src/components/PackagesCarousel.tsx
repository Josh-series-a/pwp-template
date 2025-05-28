
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Package, Users, Target, TrendingUp, Shield, Star } from 'lucide-react';

const PackagesCarousel = () => {
  const packages = [
    {
      id: 1,
      title: "Starter Package",
      description: "Perfect for new businesses looking to establish their foundation",
      icon: <Package className="h-6 w-6" />,
      features: ["Business Planning", "Basic Strategy", "Initial Setup"]
    },
    {
      id: 2,
      title: "Growth Package", 
      description: "Scale your business with advanced strategies and tools",
      icon: <TrendingUp className="h-6 w-6" />,
      features: ["Advanced Analytics", "Growth Strategy", "Team Building"]
    },
    {
      id: 3,
      title: "Enterprise Package",
      description: "Comprehensive solutions for established businesses",
      icon: <Shield className="h-6 w-6" />,
      features: ["Full Support", "Custom Solutions", "Priority Access"]
    },
    {
      id: 4,
      title: "Premium Package",
      description: "Elite package for businesses ready to dominate their market",
      icon: <Star className="h-6 w-6" />,
      features: ["Executive Coaching", "Market Leadership", "Innovation Labs"]
    }
  ];

  return (
    <div className="w-full space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">
            Plan Your Business Legacy with Confidence
          </CardTitle>
          <p className="text-blue-700 mt-2">
            Choose the perfect package to accelerate your business growth and build lasting success
          </p>
        </CardHeader>
      </Card>

      <div className="relative">
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent className="-ml-2 md:-ml-4">
            {packages.map((pkg) => (
              <CarouselItem key={pkg.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {pkg.icon}
                      </div>
                      <CardTitle className="text-lg">{pkg.title}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Key Features:</h4>
                      <ul className="space-y-1">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default PackagesCarousel;
