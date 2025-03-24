
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle
} from 'lucide-react';

const BookSession = () => {
  return (
    <DashboardLayout title="Book a Coaching Session">
      <div className="max-w-4xl mx-auto space-y-8">
        <p className="text-muted-foreground">
          Connect with a real coach to go deeper into your business challenges and opportunities.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Coach</CardTitle>
                <CardDescription>Expert business advisor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-muted mb-4 overflow-hidden">
                    <img 
                      src="/lovable-uploads/c84b7480-caf5-42d4-b90e-0507c12129e0.png" 
                      alt="Coach profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold">Colin Marshall</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Business Growth Specialist
                  </p>
                </div>
                
                <div className="space-y-3 pt-4">
                  <h4 className="font-medium">Areas of Expertise:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Business Exit Planning
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Team Development
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Growth Strategy
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Financial Optimization
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Schedule Your Session</CardTitle>
                <CardDescription>
                  Choose a time that works for your schedule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Session Details:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground">60 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Video className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <p className="text-sm font-medium">Meeting Type</p>
                        <p className="text-sm text-muted-foreground">Video Call</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">Zoom Meeting</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <p className="text-sm font-medium">Availability</p>
                        <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 py-4">
                  <h3 className="font-medium">What to expect:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mt-0.5">1</span>
                      <p className="text-sm">Personalized guidance based on your business health check</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mt-0.5">2</span>
                      <p className="text-sm">Action-oriented advice you can implement immediately</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs mt-0.5">3</span>
                      <p className="text-sm">Additional resources tailored to your specific challenges</p>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-4 bg-muted/50">
                  <h3 className="font-medium mb-2">Pre-session Questions</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Help your coach prepare by sharing your top business challenges:
                  </p>
                  <textarea 
                    className="w-full p-3 border rounded-md h-24 text-sm" 
                    placeholder="What are your biggest business challenges right now?"
                  ></textarea>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Session
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookSession;
