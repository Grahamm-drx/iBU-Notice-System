import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AlertTriangle, Bell, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StudentLayout from '@/components/student/StudentLayout';
import NoticeCard from '@/components/NoticeCard';
import NoticeDetailModal from '@/components/student/NoticeDetailModal';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Notice {
  id: string;
  title: string;
  content: string;
  notice_type: 'general' | 'urgent' | 'academic' | 'event';
  priority: 'low' | 'normal' | 'high' | 'critical';
  category: 'exam' | 'events' | 'class' | 'general' | null;
  publish_date: string | null;
  expire_date: string | null;
  created_at: string;
  is_pinned: boolean;
  attachment_url: string | null;
  is_read?: boolean;
}

const UrgentNoticesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [readNoticeIds, setReadNoticeIds] = useState<Set<string>>(new Set());
  const [readTimestamps, setReadTimestamps] = useState<Record<string, string>>({});
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch read notices
      const { data: readData } = await supabase
        .from('notice_reads')
        .select('notice_id, read_at')
        .eq('user_id', user.id);

      const readIds = new Set(readData?.map((r) => r.notice_id) || []);
      const timestamps: Record<string, string> = {};
      readData?.forEach((r) => {
        timestamps[r.notice_id] = r.read_at;
      });
      setReadNoticeIds(readIds);
      setReadTimestamps(timestamps);

      // Fetch urgent notices only
      const { data: noticesData } = await supabase
        .from('notices')
        .select('*')
        .eq('is_published', true)
        .eq('notice_type', 'urgent')
        .order('created_at', { ascending: false });

      if (noticesData) {
        const noticesWithReadStatus = noticesData.map((n) => ({
          ...n,
          is_read: readIds.has(n.id),
        })) as Notice[];
        setNotices(noticesWithReadStatus);
      }

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();

      // Auto-refresh every 5 minutes
      const interval = setInterval(() => {
        setRefreshing(true);
        fetchData();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const markAsRead = async (noticeId: string) => {
    if (!user || readNoticeIds.has(noticeId)) return;

    try {
      const now = new Date().toISOString();
      await supabase.from('notice_reads').upsert({
        notice_id: noticeId,
        user_id: user.id,
      });
      setReadNoticeIds((prev) => new Set([...prev, noticeId]));
      setReadTimestamps((prev) => ({ ...prev, [noticeId]: now }));
      setNotices((prev) =>
        prev.map((n) => (n.id === noticeId ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notice as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const unreadNotices = notices.filter((n) => !readNoticeIds.has(n.id));
      const now = new Date().toISOString();

      await Promise.all(
        unreadNotices.map((n) =>
          supabase.from('notice_reads').upsert({
            notice_id: n.id,
            user_id: user.id,
          })
        )
      );

      const newReadIds = new Set([
        ...readNoticeIds,
        ...unreadNotices.map((n) => n.id),
      ]);
      setReadNoticeIds(newReadIds);

      const newTimestamps = { ...readTimestamps };
      unreadNotices.forEach((n) => {
        newTimestamps[n.id] = now;
      });
      setReadTimestamps(newTimestamps);

      setNotices((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success('All notices marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
    markAsRead(notice.id);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/student/login" replace />;
  }

  const unreadCount = notices.filter((n) => !readNoticeIds.has(n.id)).length;

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header with red theme */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-destructive/30 via-destructive/20 to-destructive/30 rounded-2xl blur-xl opacity-70" />
          <div className="relative bg-destructive/5 backdrop-blur-sm rounded-2xl p-6 border border-destructive/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-destructive/10 text-destructive">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-destructive">
                    Urgent Notices
                  </h1>
                  <p className="text-destructive/70 mt-1">
                    Critical announcements requiring immediate attention
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="destructive" className="text-lg px-4 py-1">
                  {notices.length} Urgent
                </Badge>
                {unreadCount > 0 && (
                  <Badge variant="outline" className="border-destructive/30 text-destructive">
                    {unreadCount} Unread
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Auto-refreshes every 5 minutes • Last updated:{' '}
            {lastRefresh.toLocaleTimeString()}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {unreadCount > 0 && (
              <Button
                size="sm"
                onClick={markAllAsRead}
                className="gap-2 bg-destructive hover:bg-destructive/90"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        {/* Notices List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="w-8 h-8 animate-spin text-destructive relative" />
            </div>
          </div>
        ) : notices.length === 0 ? (
          <Card className="bg-card/60 backdrop-blur-sm border-border/30">
            <CardContent className="py-12 text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-500/10 rounded-full blur-xl" />
                <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4 relative" />
              </div>
              <p className="text-muted-foreground">
                No urgent notices at the moment. You're all caught up!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {notices.map((notice, index) => (
              <div
                key={notice.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <NoticeCard notice={notice} onClick={() => handleNoticeClick(notice)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notice Detail Modal */}
      <NoticeDetailModal
        notice={selectedNotice}
        isOpen={!!selectedNotice}
        onClose={() => setSelectedNotice(null)}
        isRead={selectedNotice ? readNoticeIds.has(selectedNotice.id) : false}
        readAt={selectedNotice ? readTimestamps[selectedNotice.id] : null}
        onMarkAsRead={() => selectedNotice && markAsRead(selectedNotice.id)}
      />
    </StudentLayout>
  );
};

export default UrgentNoticesPage;
