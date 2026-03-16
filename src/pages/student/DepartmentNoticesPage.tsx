import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Building2, Loader2, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StudentLayout from '@/components/student/StudentLayout';
import NoticeCard from '@/components/NoticeCard';
import NoticeDetailModal from '@/components/student/NoticeDetailModal';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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
  target_departments: string[] | null;
  is_read?: boolean;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

const DepartmentNoticesPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [userDepartment, setUserDepartment] = useState<Department | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [readNoticeIds, setReadNoticeIds] = useState<Set<string>>(new Set());
  const [readTimestamps, setReadTimestamps] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchDepartments = async () => {
      const { data } = await supabase.from('departments').select('*');
      if (data) {
        setDepartments(data);

        // Set user's department as default
        if (profile?.department_id) {
          const userDept = data.find((d) => d.id === profile.department_id);
          if (userDept) {
            setUserDepartment(userDept);
            setSelectedDeptId(userDept.id);
          }
        }
      }
    };

    fetchDepartments();
  }, [profile]);

  useEffect(() => {
    const fetchNotices = async () => {
      if (!user || !selectedDeptId) return;

      setLoading(true);
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

        // Fetch all published notices
        const { data: noticesData } = await supabase
          .from('notices')
          .select('*')
          .eq('is_published', true)
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (noticesData) {
          // Filter to notices that target this department or all
          const filteredNotices = noticesData.filter(
            (n) =>
              n.target_all ||
              n.target_departments === null ||
              n.target_departments?.length === 0 ||
              n.target_departments?.includes(selectedDeptId)
          );

          const noticesWithReadStatus = filteredNotices.map((n) => ({
            ...n,
            is_read: readIds.has(n.id),
          })) as Notice[];
          setNotices(noticesWithReadStatus);
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDeptId) {
      fetchNotices();
    }
  }, [user, selectedDeptId]);

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

  const selectedDept = departments.find((d) => d.id === selectedDeptId);

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-faculty/20 via-accent/10 to-faculty/20 rounded-2xl blur-xl opacity-50" />
          <div className="relative bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-faculty/10 text-faculty">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Department Notices
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Notices targeted to your department
                  </p>
                </div>
              </div>

              {/* Department Selector */}
              <div className="flex items-center gap-3">
                <Select value={selectedDeptId} onValueChange={setSelectedDeptId}>
                  <SelectTrigger className="w-64 bg-card/60 border-border/30">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{dept.code}</span>
                          <span className="text-muted-foreground">-</span>
                          <span>{dept.name}</span>
                          {dept.id === userDepartment?.id && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              My Dept
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Department Info */}
        {selectedDept && (
          <Card className="bg-faculty/5 border-faculty/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-faculty/10 text-faculty border-faculty/30 text-lg px-4 py-1">
                    {selectedDept.code}
                  </Badge>
                  <span className="font-semibold text-lg">{selectedDept.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {notices.length} notices
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notices List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-faculty/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="w-8 h-8 animate-spin text-faculty relative" />
            </div>
          </div>
        ) : !selectedDeptId ? (
          <Card className="bg-card/60 backdrop-blur-sm border-border/30">
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Please select a department to view notices.
              </p>
            </CardContent>
          </Card>
        ) : notices.length === 0 ? (
          <Card className="bg-card/60 backdrop-blur-sm border-border/30">
            <CardContent className="py-12 text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-faculty/10 rounded-full blur-xl" />
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4 relative" />
              </div>
              <p className="text-muted-foreground">
                No notices for {selectedDept?.name || 'this department'} at the moment.
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

export default DepartmentNoticesPage;
