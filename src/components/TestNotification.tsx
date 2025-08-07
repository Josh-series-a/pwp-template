import React from 'react';
import { Button } from '@/components/ui/button';
import { notifications } from '@/utils/notificationHelpers';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const TestNotification: React.FC = () => {
  const { user } = useAuth();

  const createTestNotifications = async () => {
    if (!user) {
      toast.error('Please log in to test notifications');
      return;
    }

    try {
      // Create various test notifications
      await notifications.notifyWelcome(user.id);
      await notifications.notifyExerciseCompleted(user.id, 'How Does Stress Affect You?');
      await notifications.notifyReportReady(user.id, 'TalentLynk');
      await notifications.notifyCreditsAdded(user.id, 100);
      await notifications.notifyLowCredits(user.id, 50);
      
      toast.success('Test notifications created!');
    } catch (error) {
      console.error('Error creating test notifications:', error);
      toast.error('Failed to create test notifications');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 border border-border rounded-lg bg-background">
      <h3 className="text-lg font-semibold mb-2">Test Notifications</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Create sample notifications to test the notification system.
      </p>
      <Button onClick={createTestNotifications} variant="outline">
        Create Test Notifications
      </Button>
    </div>
  );
};

export default TestNotification;