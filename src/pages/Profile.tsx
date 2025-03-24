
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Building, 
  Globe, 
  Mail, 
  BookOpen,
  Bell,
  UploadCloud
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    preferredFocus: 'growth',
    coachingGoals: 'increase_profit',
    emailNotifications: true
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.user_metadata?.name || '',
        email: user.email || ''
      }));
      
      // In a real app, fetch additional profile data from the database
      // For now, we'll just use the data we have from auth
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, you would update the profile in Supabase
      // For now we'll just show a success message
      
      // Example implementation:
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({
      //     name: profileData.name,
      //     company: profileData.company,
      //     website: profileData.website,
      //     preferred_focus: profileData.preferredFocus,
      //     coaching_goals: profileData.coachingGoals,
      //     email_notifications: profileData.emailNotifications
      //   })
      //   .eq('id', user?.id);
      
      // if (error) throw error;
      
      // For demo purposes, we'll just show a success message
      setTimeout(() => {
        toast.success('Profile updated successfully!');
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Profile Settings">
      <div className="max-w-4xl mx-auto space-y-8">
        <p className="text-muted-foreground">
          Manage your personal information and preferences
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your account details and business information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    name="name"
                    placeholder="Your name" 
                    className="pl-10" 
                    value={profileData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    name="email"
                    type="email"
                    readOnly
                    placeholder="Your email" 
                    className="pl-10" 
                    value={profileData.email}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="company" 
                    name="company"
                    placeholder="Your company" 
                    className="pl-10" 
                    value={profileData.company}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="website" 
                    name="website"
                    placeholder="Your website URL" 
                    className="pl-10" 
                    value={profileData.website}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-16 h-16 border rounded-md flex items-center justify-center bg-muted">
                  {profileData.company ? (
                    <span className="text-xl font-bold text-muted-foreground">
                      {profileData.company.charAt(0)}
                    </span>
                  ) : (
                    <Building className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <Button variant="outline" type="button">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your experience and communication settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="preferredFocus">Preferred Chapter Focus</Label>
                <div className="relative mt-2">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select 
                    id="preferredFocus" 
                    name="preferredFocus" 
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                    value={profileData.preferredFocus}
                    onChange={handleInputChange}
                  >
                    <option value="growth">Business Growth</option>
                    <option value="team">Team Development</option>
                    <option value="exit">Exit Planning</option>
                    <option value="profit">Profit Optimization</option>
                  </select>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  We'll prioritize content from these chapters in your dashboard.
                </p>
              </div>
              
              <div>
                <Label htmlFor="coachingGoals">Coaching Goals</Label>
                <div className="relative mt-2">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select 
                    id="coachingGoals" 
                    name="coachingGoals" 
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                    value={profileData.coachingGoals}
                    onChange={handleInputChange}
                  >
                    <option value="increase_profit">Increase Profit</option>
                    <option value="improve_team">Improve Team Performance</option>
                    <option value="prepare_exit">Prepare for Business Exit</option>
                    <option value="scale_business">Scale Business</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Communication Settings</h3>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="emailNotifications" 
                  name="emailNotifications"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={profileData.emailNotifications}
                  onChange={handleInputChange}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="emailNotifications"
                    className="text-sm font-medium leading-none flex items-center gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    Email Notifications
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Receive emails about new exercises, coaching sessions, and updates.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
