import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { FileText, Plus, TrendingUp, Eye, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FacultyLayout from '@/components/faculty/FacultyLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';

interface Notice {
  id: string;
  title: string;
  notice_type: string;
  priority: string;
  is_published: boolean;
  created_at: string;
  category: string | null;
}

const FacultyDashboardPage = () => {
  const { user, role, loading: authLoading } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [readCounts, setReadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      const { data: noticeData } = await supabase
        .from('notices')
        .select('id, title, notice_type, priority, is_published, created_at, category')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      const all = (noticeData || []) as Notice[];
      setNotices(all);

      // Fetch read counts for published notices
      const publishedIds = all.filter((n) => n.is_published).map((n) => n.id);
      if (publishedIds.length > 0) {
        const { data: reads } = await supabase
          .from('notice_reads')
          .select('notice_id')
          .in('notice_id', publishedIds);

        const counts: Record<string, number> = {};
        reads?.forEach((r) => {
          counts[r.notice_id] = (counts[r.notice_id] || 0) + 1;
        });
        setReadCounts(counts);
      }

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

  if (!user) return <Navigate to="/" replace />;

  const published = notices.filter((n) => n.is_published);
  const drafts = notices.filter((n) => !n.is_published);
  const totalReads = Object.values(readCounts).reduce((a, b) => a + b, 0);
  const recentNotices = notices.slice(0, 5);

  return (
    <FacultyLayout>
      <div className="space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">
              Manage your notices and track engagement
            </p>
          </div>
          <Link to="/faculty/notices/create">
            <Button className="bg-faculty hover:bg-faculty/90 text-faculty-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Create Notice
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-faculty/10">
                  <FileText className="w-5 h-5 text-faculty" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{notices.length}</p>
                  <p className="text-xs text-muted-foreground">Total Notices</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-green-500/10">
                  <Eye className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{published.length}</p>
                  <p className="text-xs text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-muted">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{drafts.length}</p>
                  <p className="text-xs text-muted-foreground">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-faculty/10">
                  <TrendingUp className="w-5 h-5 text-faculty" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalReads}</p>
                  <p className="text-xs text-muted-foreground">Total Reads</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notices */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Notices</CardTitle>
            <Link to="/faculty/notices">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-faculty" />
              </div>
            ) : recentNotices.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No notices yet</p>
                <Link to="/faculty/notices/create">
                  <Button variant="outline" size="sm" className="mt-3">
                    <Plus className="w-4 h-4 mr-1" />
                    Create your first notice
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-medium text-sm truncate">{notice.title}</h4>
                        <Badge
                          variant={notice.is_published ? 'default' : 'secondary'}
                          className={notice.is_published ? 'bg-green-500 text-white text-[10px] px-1.5' : 'text-[10px] px-1.5'}
                        >
                          {notice.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notice.created_at), { addSuffix: true })}
                        {notice.is_published && readCounts[notice.id]
                          ? ` · ${readCounts[notice.id]} read${readCounts[notice.id] !== 1 ? 's' : ''}`
                          : ''}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize text-[10px]">
                      {notice.notice_type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FacultyLayout>
  );
};

export default FacultyDashboardPage;
