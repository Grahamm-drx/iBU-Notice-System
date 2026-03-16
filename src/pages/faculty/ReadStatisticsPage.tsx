import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BarChart3, Loader2, Eye, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import FacultyLayout from '@/components/faculty/FacultyLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface NoticeWithReads {
  id: string;
  title: string;
  notice_type: string;
  created_at: string;
  readCount: number;
}

const ReadStatisticsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [notices, setNotices] = useState<NoticeWithReads[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      // Get published notices by this faculty
      const { data: noticeData } = await supabase
        .from('notices')
        .select('id, title, notice_type, created_at')
        .eq('author_id', user.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      const noticeList = noticeData || [];

      if (noticeList.length > 0) {
        const ids = noticeList.map((n) => n.id);
        const { data: reads } = await supabase
          .from('notice_reads')
          .select('notice_id')
          .in('notice_id', ids);

        const counts: Record<string, number> = {};
        reads?.forEach((r) => {
          counts[r.notice_id] = (counts[r.notice_id] || 0) + 1;
        });

        setNotices(
          noticeList.map((n) => ({
            ...n,
            readCount: counts[n.id] || 0,
          }))
        );
      }

      // Get total student count for percentage
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      setTotalStudents(count || 1);

      setLoading(false);
    };

    fetch();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-faculty" />
      </div>
    );
  }

  if (!user) return <Navigate to="/faculty/login" replace />;

  const totalReads = notices.reduce((a, b) => a + b.readCount, 0);
  const avgRate = notices.length > 0
    ? Math.round((totalReads / (notices.length * totalStudents)) * 100)
    : 0;

  return (
    <FacultyLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Read Statistics</h1>
          <p className="text-muted-foreground mt-1">Track engagement across your notices</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-faculty/10">
                  <Eye className="w-5 h-5 text-faculty" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalReads}</p>
                  <p className="text-xs text-muted-foreground">Total Reads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-green-500/10">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgRate}%</p>
                  <p className="text-xs text-muted-foreground">Avg Read Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-faculty/10">
                  <BarChart3 className="w-5 h-5 text-faculty" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{notices.length}</p>
                  <p className="text-xs text-muted-foreground">Published Notices</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Per-notice breakdown */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Per-Notice Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-faculty" />
              </div>
            ) : notices.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No published notices yet
              </p>
            ) : (
              <div className="space-y-4">
                {notices.map((notice) => {
                  const rate = Math.min(100, Math.round((notice.readCount / totalStudents) * 100));
                  return (
                    <div key={notice.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium text-sm truncate">{notice.title}</span>
                          <Badge variant="outline" className="capitalize text-[10px] shrink-0">
                            {notice.notice_type}
                          </Badge>
                        </div>
                        <span className="text-sm font-semibold text-faculty shrink-0 ml-2">
                          {notice.readCount} read{notice.readCount !== 1 ? 's' : ''} ({rate}%)
                        </span>
                      </div>
                      <Progress value={rate} className="h-2" />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FacultyLayout>
  );
};

export default ReadStatisticsPage;
