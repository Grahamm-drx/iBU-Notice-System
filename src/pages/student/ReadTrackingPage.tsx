import { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Loader2,
  Megaphone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const ReadTrackingPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [readNoticeIds, setReadNoticeIds] = useState<Set<string>>(new Set());
  const [readTimestamps, setReadTimestamps] = useState<Record<string, string>>({});

  useEffect(() => {
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

        // Fetch all notices
        const { data: noticesData } = await supabase
          .from('notices')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (noticesData) {
          const noticesWithReadStatus = noticesData.map((n) => ({
            ...n,
            is_read: readIds.has(n.id),
          })) as Notice[];
          setNotices(noticesWithReadStatus);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

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

  const stats = useMemo(() => {
    const total = notices.length;
    const read = readNoticeIds.size;
    const unread = total - read;
    const percentage = total > 0 ? Math.round((read / total) * 100) : 0;

    // Category breakdown
    const categories = {
      exam: { total: 0, read: 0 },
      events: { total: 0, read: 0 },
      class: { total: 0, read: 0 },
      general: { total: 0, read: 0 },
    };

    notices.forEach((n) => {
      const cat = n.category || 'general';
      if (categories[cat]) {
        categories[cat].total++;
        if (readNoticeIds.has(n.id)) {
          categories[cat].read++;
        }
      }
    });

    return { total, read, unread, percentage, categories };
  }, [notices, readNoticeIds]);

  const readNotices = notices.filter((n) => readNoticeIds.has(n.id));
  const unreadNotices = notices.filter((n) => !readNoticeIds.has(n.id));

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

  const categoryConfig = {
    exam: { icon: <BookOpen className="w-4 h-4" />, label: 'Exam', color: 'text-primary' },
    events: { icon: <Calendar className="w-4 h-4" />, label: 'Events', color: 'text-green-600' },
    class: { icon: <Megaphone className="w-4 h-4" />, label: 'Class', color: 'text-purple-600' },
    general: { icon: <Bell className="w-4 h-4" />, label: 'General', color: 'text-muted-foreground' },
  };

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-accent/10 to-green-500/20 rounded-2xl blur-xl opacity-50" />
          <div className="relative bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-green-500/10 text-green-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Read Tracking
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Track your notice reading progress
                  </p>
                </div>
              </div>

              {stats.unread > 0 && (
                <Button onClick={markAllAsRead} className="gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Mark All as Read
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="bg-card/60 backdrop-blur-sm border-border/30">
          <CardHeader>
            <CardTitle>Reading Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {stats.read} of {stats.total} notices read
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {stats.percentage}%
                </span>
              </div>
              <Progress value={stats.percentage} className="h-3" />
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-secondary/50 text-center">
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 text-center">
                <p className="text-3xl font-bold text-green-600">{stats.read}</p>
                <p className="text-sm text-muted-foreground">Read</p>
              </div>
              <div className="p-4 rounded-xl bg-accent/10 text-center">
                <p className="text-3xl font-bold text-accent">{stats.unread}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 text-center">
                <p className="text-3xl font-bold text-primary">{stats.percentage}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>

            {/* Category breakdown */}
            <div>
              <h4 className="font-semibold mb-3">By Category</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(stats.categories).map(([key, value]) => {
                  const config = categoryConfig[key as keyof typeof categoryConfig];
                  const pct = value.total > 0 ? Math.round((value.read / value.total) * 100) : 0;
                  return (
                    <div
                      key={key}
                      className="p-3 rounded-xl border border-border/30 bg-card/50"
                    >
                      <div className={`flex items-center gap-2 mb-2 ${config.color}`}>
                        {config.icon}
                        <span className="font-medium capitalize">{config.label}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {value.read}/{value.total}
                        </span>
                        <span className="font-semibold">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5 mt-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notices Tabs */}
        <Tabs defaultValue="unread" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="unread" className="gap-2">
              <Circle className="w-4 h-4" />
              Unread ({stats.unread})
            </TabsTrigger>
            <TabsTrigger value="read" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Read ({stats.read})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : unreadNotices.length === 0 ? (
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4" />
                  <p className="text-muted-foreground">
                    You've read all notices! 🎉
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {unreadNotices.map((notice, index) => (
                  <div
                    key={notice.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <NoticeCard
                      notice={notice}
                      onClick={() => handleNoticeClick(notice)}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="read" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : readNotices.length === 0 ? (
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardContent className="py-12 text-center">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No read notices yet. Start reading!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {readNotices.map((notice, index) => (
                  <div
                    key={notice.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <NoticeCard
                      notice={notice}
                      onClick={() => handleNoticeClick(notice)}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
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

export default ReadTrackingPage;
