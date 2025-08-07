import React from 'react';
import { X, Bell, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "Exercise Completed",
      message: "You've successfully completed the 'How Does Stress Affect You?' exercise",
      time: "2 hours ago",
      type: "success",
      read: false
    },
    {
      id: 2,
      title: "New Report Available",
      message: "Your Business Health Score report for 'TalentLynk' is ready",
      time: "1 day ago",
      type: "info",
      read: false
    },
    {
      id: 3,
      title: "Credit Purchase Confirmed",
      message: "100 credits have been added to your account",
      time: "2 days ago",
      type: "success",
      read: true
    },
    {
      id: 4,
      title: "Low Credits Warning",
      message: "You have less than 50 credits remaining",
      time: "3 days ago",
      type: "warning",
      read: true
    },
    {
      id: 5,
      title: "Welcome to Prosper With Purpose",
      message: "Get started by completing your first exercise",
      time: "1 week ago",
      type: "info",
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={onClose}
        />
      )}
      
      {/* Notifications Panel */}
      <div className={`fixed left-16 top-0 h-screen w-64 bg-background border-r border-border shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <h2 className="font-semibold text-lg">Notifications</h2>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
          <div className="p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 mb-2 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 ${
                  !notification.read ? 'bg-accent/20 border-primary/20' : 'bg-background border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full ml-auto"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

      </div>
    </>
  );
};

export default NotificationsPanel;