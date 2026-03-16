import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/integrations/api/client';
import { useAuth } from '@/hooks/useAuth';

export interface Notification {
  id: string;
  title: string;
  content: string;
  priority: string;
  category: string | null;
  created_at: string;
  isUrgent: boolean;
  time: string;
  is_read: boolean;
  author_id: string;
  department_id: number | null;
}

export const useNotifications = () => {
  const { user, profile, role } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [urgentCount, setUrgentCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user || !profile || !role) return;

    setLoading(true);
    try {
      // Role-specific API filtering
      const params: Record<string, string> = {
        status: 'A'
      };

      if (role === 'student' || role === 'faculty') {
        if (profile.department_id) {
          params.department_id = profile.department_id.toString();
        }
      }
      if (role === 'faculty') {
        params.author_id = user.id;
      }
      // Admin sees all (no params)

        const noticesData = await (apiClient.notices as any).list(params);

      if (noticesData) {
        const notificationsList: Notification[] = noticesData.map((notice: any) => ({
          id: notice.id.toString(),
          title: notice.title,
          content: notice.content,
          priority: notice.priority.toLowerCase(),
          category: notice.category,
          created_at: notice.created_at,
          author_id: notice.author_id,
          department_id: notice.department_id,
          isUrgent: notice.priority === 'high' || notice.priority === 'critical' || notice.priority === 'Urgent',
          time: new Date(notice.created_at).toLocaleString(),
          is_read: false // Backend doesn't have reads yet - client tracks
        }));

        const recent5 = notificationsList.slice(0, 5);
        setNotifications(recent5);
        const unread = notificationsList.filter(n => !n.is_read);
        setUnreadCount(unread.length);
        const urgentUnread = unread.filter(n => n.isUrgent);
        setUrgentCount(urgentUnread.length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user, profile, role]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const refresh = fetchNotifications;

  return {
    notifications,
    urgentCount,
    unreadCount,
    loading,
    refresh,
  };
};

