import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/integrations/api/client';
import { useAuth } from '@/hooks/useAuth';

export interface AdminNotification {
  id: string;
  title: string;
  time: string;
  type: 'notice' | 'user' | 'system';
  isUrgent: boolean;
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAdminNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // Admin notifications: pending notices + new users
      const pendingNotices = await apiClient.notices.list({ status: 'expired' });
      const recentUsers = await apiClient.users.list();
      const stats = await apiClient.stats.analytics();

      const adminNotifications: AdminNotification[] = [];

      // Pending/Draft notices
      pendingNotices.slice(0, 4).forEach(notice => {
        adminNotifications.push({
          id: `pending-${notice.id}`,
          title: `${notice.priority === 'Urgent' ? 'URGENT' : 'EXPIRED'}: ${notice.title}`,
          time: new Date(notice.created_at).toLocaleString(),
          type: 'notice' as const,
          isUrgent: notice.priority === 'Urgent',
        });
      });

      // New users today (simulate)
      adminNotifications.push({
        id: 'new-users',
        title: `${stats.students + stats.faculty} new users registered`,
        time: new Date().toLocaleString(),
        type: 'user' as const,
        isUrgent: false,
      });

      // Low read rate alert
      if (stats.readRate < 30) {
        adminNotifications.push({
          id: 'low-read-rate',
          title: 'Low notice read rate detected',
          time: new Date().toLocaleString(),
          type: 'system' as const,
          isUrgent: true,
        });
      }

      setNotifications(adminNotifications.slice(0, 6));
      setNotificationCount(adminNotifications.length);
    } catch (error) {
      console.error('Failed to fetch admin notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminNotifications();
    const interval = setInterval(fetchAdminNotifications, 60000); // 1 min
    return () => clearInterval(interval);
  }, [fetchAdminNotifications]);

  return {
    notifications,
    notificationCount,
    loading,
    refresh: fetchAdminNotifications,
  };
};

