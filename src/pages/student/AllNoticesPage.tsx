import { useEffect, useState, useMemo, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { Bell, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import StudentLayout from '@/components/student/StudentLayout';
import NoticeCard from '@/components/NoticeCard';
import NoticeFilters from '@/components/student/NoticeFilters';
import NoticeDetailModal from '@/components/student/NoticeDetailModal';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/integrations/api/client';

interface Notice {
  id: string;
  title: string;
  content: string;
  priority: string;
  category: string | null;
  created_at: string;
  notice_type?: 'general' | 'urgent' | 'academic' | 'event';
  publish_date?: string;
  expire_date?: string;
  is_pinned: boolean;
  attachment_url: string | null;
  department_id: number | null;
  author_id: string;
  is_read?: boolean;
  read_at?: string;
}

interface Department {
  id: string;
  code: string;
  name: string;
}

const AllNoticesPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [readNoticeIds, setReadNoticeIds] = useState<Set<string>>(new Set());
  const [readTimestamps, setReadTimestamps] = useState<Record<string, string>>({});

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [readStatusFilter, setReadStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!user || !profile) return;

    setLoading(true);
    setError(null);
    try {
      // Departments
      const deptsData = await apiClient.departments.list();
      setDepartments(deptsData || []);

      // Notices
      const params = { status: 'A' };
      const noticesData = await apiClient.notices.list(params);

      // Read status
      const noticeIds = noticesData.map((n: {id: number}) => n.id.toString());
      const readData = await apiClient.noticeReads.getBulk(noticeIds.map(id => Number(id)));
      const readIds = new Set(readData.map((r: {NoticeID: number}) => r.NoticeID.toString()));
      const timestamps: Record<string, string> = {};
      readData.forEach((r: {NoticeID: number, ReadDate: string}) => timestamps[r.NoticeID.toString()] = r.ReadDate || new Date().toISOString());

      const noticesWithRead = noticesData.map((n) => {
        const cat = (n.category || 'general').toLowerCase();
        const noticeType = n.priority === 'Urgent' ? 'urgent' : (cat === 'exam' || cat === 'class' ? 'academic' : cat === 'events' ? 'event' : 'general');
        return {
          ...n,
          id: n.id.toString(),
          notice_type: noticeType,
          priority: n.priority === 'Urgent' ? 'critical' : (n.priority || 'normal').toLowerCase(),
          is_read: readIds.has(n.id.toString()),
          read_at: timestamps[n.id.toString()] || null,
          publish_date: n.created_at,
        } as Notice;
      });
      setNotices(noticesWithRead);
      setReadNoticeIds(readIds);
      setReadTimestamps(timestamps);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Failed to load notices';
      setError(errMsg);
      toast({
        title: "Load failed",
        description: errMsg,
      });
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const markAsRead = async (noticeId: string) => {
    if (!user || readNoticeIds.has(noticeId)) return;

    try {
      await apiClient.noticeReads.markAsRead(Number(noticeId));
      const now = new Date().toISOString();
      setReadNoticeIds((prev) => new Set([...Array.from(prev as Set<string>), noticeId]));
      setReadTimestamps((prev) => ({ ...prev, [noticeId]: now }));
      setNotices((prev) => prev.map((n) => n.id === noticeId ? { ...n, is_read: true, read_at: now } : n));
    } catch (error) {
      console.error('Mark read error:', error);
    }
  };

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
    markAsRead(notice.id);
  };

  const filteredNotices = useMemo(() => {
    let filtered = notices;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }

    if (categoryFilter !== 'all') filtered = filtered.filter(n => n.category === categoryFilter);
    if (priorityFilter !== 'all') filtered = filtered.filter(n => n.priority === priorityFilter);
    if (readStatusFilter === 'read') filtered = filtered.filter(n => n.is_read);
    else if (readStatusFilter === 'unread') filtered = filtered.filter(n => !n.is_read);

    return filtered.sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'priority') {
        const prioOrder = { 'critical': 0, 'high': 1, 'normal': 2, 'low': 3 };
        return (prioOrder[b.priority as keyof typeof prioOrder] || 2) - (prioOrder[a.priority as keyof typeof prioOrder] || 2);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [notices, searchQuery, categoryFilter, priorityFilter, readStatusFilter, sortBy]);

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!user) return <Navigate to="/student/login" />;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="bg-card/60 backdrop-blur p-6 rounded-2xl border">
          <h1 className="text-3xl font-bold">All Notices</h1>
          <p className="text-muted-foreground mt-1">Browse all available notices with filters</p>
        </div>

        <NoticeFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          readStatusFilter={readStatusFilter}
          onReadStatusChange={setReadStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          departments={departments}
          activeFiltersCount={Object.values({categoryFilter, priorityFilter, readStatusFilter}).filter(v => v !== 'all').length}
          onClearFilters={() => {
            setSearchQuery('');
            setCategoryFilter('all');
            setPriorityFilter('all');
            setReadStatusFilter('all');
            setSortBy('latest');
          }}
        />

        {error ? (
          <Card>
            <CardHeader>
              <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-center">Load Error</h3>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl font-medium transition-all"
              >
                Retry
              </button>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredNotices.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No notices found matching your filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={{...notice, publish_date: notice.created_at }} onClick={() => handleNoticeClick(notice)} />
            ))}
          </div>
        )}

        <NoticeDetailModal
          notice={selectedNotice}
          isOpen={!!selectedNotice}
          onClose={() => setSelectedNotice(null)}
          isRead={!!selectedNotice?.is_read}
          onMarkAsRead={() => selectedNotice && markAsRead(selectedNotice.id)}
        />
      </div>
    </StudentLayout>
  );
};

export default AllNoticesPage;
