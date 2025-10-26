import { useNotificationStore } from '@/store/notificationStore';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types';

export const useNotifications = () => {
  const { toast } = useToast();
  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationStore();

  const showNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    // Add to store
    addNotification(notification);
    
    // Show toast
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'booking' ? 'default' : 'default',
    });
  };

  const showBookingNotification = (title: string, message: string) => {
    showNotification({
      userId: 'current-user', // This would be the actual user ID
      title,
      message,
      type: 'booking',
      read: false,
    });
  };

  const showPaymentNotification = (title: string, message: string) => {
    showNotification({
      userId: 'current-user',
      title,
      message,
      type: 'payment',
      read: false,
    });
  };

  const showMessageNotification = (title: string, message: string) => {
    showNotification({
      userId: 'current-user',
      title,
      message,
      type: 'message',
      read: false,
    });
  };

  const showSystemNotification = (title: string, message: string) => {
    showNotification({
      userId: 'current-user',
      title,
      message,
      type: 'system',
      read: false,
    });
  };

  return {
    notifications,
    unreadCount,
    showNotification,
    showBookingNotification,
    showPaymentNotification,
    showMessageNotification,
    showSystemNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
};
