import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { FileText, Plus, Eye, Edit, Trash2, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import FacultyLayout from '@/components/faculty/FacultyLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Notice {
  id: string;
  title: string;
  content: string;
  notice_type: string;
  priority: string;
  category: string | null;
  is_published: boolean;
  is_pinned: boolean;
  publish_date: string | null;
  created_at: string;
  status: string;
}

const MyNoticesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchNotices = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices((data as Notice[]) || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchNotices();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      if (error) throw error;
      toast.success('Notice deleted');
      fetchNotices();
    } catch {
      toast.error('Failed to delete notice');
    }
  };

  const togglePublish = async (notice: Notice) => {
    try {
      const { error } = await supabase
        .from('notices')
        .update({
          is_published: !notice.is_published,
          publish_date: !notice.is_published ? new Date().toISOString() : null,
        })
        .eq('id', notice.id);
      if (error) throw error;
      toast.success(notice.is_published ? 'Notice unpublished' : 'Notice published');
      fetchNotices();
    } catch {
      toast.error('Failed to update notice');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-faculty" />
      </div>
    );
  }

  if (!user) return <Navigate to="/faculty/login" replace />;

  const filtered = notices.filter((n) => {
    if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter === 'published' && !n.is_published) return false;
    if (statusFilter === 'draft' && n.is_published) return false;
    if (typeFilter !== 'all' && n.notice_type !== typeFilter) return false;
    return true;
  });

  return (
    <FacultyLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Notices</h1>
            <p className="text-muted-foreground mt-1">Manage all your notices</p>
          </div>
          <Link to="/faculty/notices/create">
            <Button className="bg-faculty hover:bg-faculty/90 text-faculty-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Create Notice
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notices */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-faculty" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notices found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((notice) => (
                  <div
                    key={notice.id}
                    className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium truncate">{notice.title}</h3>
                        {notice.is_pinned && (
                          <Badge variant="outline" className="text-[10px] border-faculty text-faculty">
                            Pinned
                          </Badge>
                        )}
                        <Badge
                          variant={notice.is_published ? 'default' : 'secondary'}
                          className={notice.is_published ? 'bg-green-500 text-white text-[10px]' : 'text-[10px]'}
                        >
                          {notice.is_published ? 'Published' : 'Draft'}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-[10px]">
                          {notice.notice_type}
                        </Badge>
                        {notice.priority === 'high' || notice.priority === 'critical' ? (
                          <Badge className="bg-destructive text-destructive-foreground text-[10px]">
                            {notice.priority}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created {format(new Date(notice.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => togglePublish(notice)} title={notice.is_published ? 'Unpublish' : 'Publish'}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Link to={`/faculty/notices/${notice.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Notice</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(notice.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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

export default MyNoticesPage;
