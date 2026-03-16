import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  FileText,
  Users,
  AlertTriangle,
  Eye,
  Plus,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import RecentActivity from '@/components/admin/RecentActivity';
import NoticesChart from '@/components/admin/NoticesChart';
import apiClient from '@/integrations/api/client';

interface Notice {
  id: number;
  title: string;
  category: string | null;
  priority: string;
  is_published: boolean;
  created_at: string;
  expire_date?: string | null;
}

interface Stats {
  totalNotices: number;
  activeNotices: number;
  urgentNotices: number;
  totalUsers: number;
  students: number;
  faculty: number;
  admins: number;
  departments: number;
}

const categoryColors: Record<string, string> = {
  exam: 'bg-primary/10 text-primary',
  events: 'bg-green-500/10 text-green-600',
  class: 'bg-violet-500/10 text-violet-600',
  general: 'bg-muted text-muted-foreground',
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<Stats>({
    totalNotices: 0,
    activeNotices: 0,
    urgentNotices: 0,
    totalUsers: 0,
    students: 0,
    faculty: 0,
    admins: 0,
    departments: 0,
  });
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch notices
      const notices = await apiClient.notices.list();

      // Fetch users
      const users = await apiClient.users.list();

      // Fetch departments
      const departments = await apiClient.departments.list();

      if (notices) {
        const activeNotices = notices.filter((n: Notice) => n.is_published);
        const urgentNotices = notices.filter(
          (n: Notice) =>
            n.is_published &&
            n.priority === 'Urgent' &&
            (!n.expire_date || new Date(n.expire_date) > new Date())
        );

        setStats((prev) => ({
          ...prev,
          totalNotices: notices.length,
          activeNotices: activeNotices.length,
          urgentNotices: urgentNotices.length,
        }));

        setRecentNotices(notices.slice(0, 5));
      }

      if (users) {
        const students = users.filter((u: any) => u.role === 'student').length;
        const faculty = users.filter((u: any) => u.role === 'faculty').length;
        const admins = users.filter((u: any) => u.role === 'admin').length;

        setStats((prev) => ({
          ...prev,
          totalUsers: users.length,
          students,
          faculty,
          admins,
        }));
      }

      if (departments) {
        setStats((prev) => ({
          ...prev,
          departments: departments.length,
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening in the system.
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/notices/create" className="gap-2">
              <Plus className="w-4 h-4" />
              Create Notice
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Notices"
            value={stats.totalNotices}
            subtitle={`${stats.activeNotices} active`}
            icon={FileText}
            variant="primary"
          />
          <StatsCard
            title="Urgent Notices"
            value={stats.urgentNotices}
            subtitle="Requires attention"
            icon={AlertTriangle}
            variant="danger"
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            subtitle={`${stats.students} students, ${stats.faculty} faculty`}
            icon={Users}
            variant="success"
          />
          <StatsCard
            title="Departments"
            value={stats.departments}
            subtitle="Active departments"
            icon={Building2}
            variant="warning"
          />
        </div>

        {/* Charts */}
        <NoticesChart />

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Notices */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Recent Notices</CardTitle>
              <Button variant="ghost" size="sm" asChild className="gap-1">
                <Link to="/admin/notices">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
<ScrollArea className="h-[400px] pr-4">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-muted rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : recentNotices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mb-4 opacity-50" />
                    <p>No notices yet</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link to="/admin/notices/create">Create your first notice</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentNotices.map((notice) => (
                      <div
                        key={notice.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors group"
                      >
                        <div
                          className={`w-2 h-2 mt-2 rounded-full ${
                            notice.priority === 'Urgent'
                              ? 'bg-destructive'
                              : 'bg-primary'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground line-clamp-1">
                            {notice.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className={categoryColors[(notice.category || 'general').toLowerCase()]}
                            >
                              {notice.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {notice.created_at ? format(new Date(notice.created_at), 'MMM d, yyyy') : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          asChild
                        >
                          <Link to={`/admin/notices/edit/${notice.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;

