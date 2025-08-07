import { useState, useEffect, useCallback } from 'react';
import { notificationService, type Notification } from '@/utils/notificationService';
import { useAuth } from '@/contexts/AuthContext';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    const success = await notificationService.markAsRead(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    return success;
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const success = await notificationService.markAllAsRead();
    if (success) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    }
    return success;
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    const success = await notificationService.deleteNotification(notificationId);
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        return notification && !notification.read ? prev - 1 : prev;
      });
    }
    return success;
  }, [notifications]);

  // Create notification (for admin/system use)
  const createNotification = useCallback(async (
    userId: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const notification = await notificationService.createNotification(userId, title, message, type);
    if (notification && notification.user_id === user?.id) {
      setNotifications(prev => [notification, ...prev]);
      if (!notification.read) {
        setUnreadCount(prev => prev + 1);
      }
    }
    return notification;
  }, [user]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    let channel: any;

    const setupRealtimeSubscription = () => {
      channel = notificationService.subscribeToNotifications((payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;

        switch (eventType) {
          case 'INSERT':
            if (newRecord && newRecord.user_id === user.id) {
              setNotifications(prev => [newRecord, ...prev]);
              if (!newRecord.read) {
                setUnreadCount(prev => prev + 1);
              }
            }
            break;
          case 'UPDATE':
            if (newRecord && newRecord.user_id === user.id) {
              setNotifications(prev =>
                prev.map(n => n.id === newRecord.id ? newRecord : n)
              );
              // Update unread count if read status changed
              if (oldRecord && oldRecord.read !== newRecord.read) {
                setUnreadCount(prev => 
                  newRecord.read ? prev - 1 : prev + 1
                );
              }
            }
            break;
          case 'DELETE':
            if (oldRecord && oldRecord.user_id === user.id) {
              setNotifications(prev => prev.filter(n => n.id !== oldRecord.id));
              if (!oldRecord.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
              }
            }
            break;
        }
      });
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) {
        notificationService.unsubscribeFromNotifications(channel);
      }
    };
  }, [user]);

  // Load notifications on mount and when user changes
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    refresh: loadNotifications
  };
};