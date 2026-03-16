import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import NoticesChart from '@/components/admin/NoticesChart';
import apiClient from '@/integrations/api/client';
import { FileText, Users, Eye, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  totalNotices: number;
  activeNotices: number;
  totalReads: number;
  readRate: number;
  totalUsers: number;
  activeUsers: number;
}

const AnalyticsPage = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalNotices: 0,
    activeNotices: 0,
    totalReads: 0,
    readRate: 0,
    totalUsers: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Use API client for consistency (backend handles correct schema)
      const notices = await apiClient.notices.list();
      
      // Mock reads data - backend getBulk doesn't exist, use fallback
      // Real reads count from backend bulk endpoint (fix param format)
      const noticeIds = (notices || []).map(n => n.id).join(',');
      const readsData = noticeIds ? await fetch(`http://localhost:3001/api/notice-reads/bulk?notice_ids=${noticeIds}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(r => r.ok ? r.json() : []) : [];

      const readNoticeIds = new Set(readsData.map(r => r.NoticeID));
      const readNoticesCount = readNoticeIds.size;
      const totalReads = readsData.length;

      // User count from /api/users (admin only)
      const usersData = await fetch('http://localhost:3001/api/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(r => r.ok ? r.json() : []);

      const now = new Date().toISOString();

      const activeNotices = (notices || []).filter((n) => 
        (n.is_published ?? true) && (!n.expire_date || new Date(n.expire_date) > new Date())
      );

      const readRate = activeNotices.length > 0
        ? Math.round((readNoticesCount / activeNotices.length) * 100)
        : 0;

      const totalUsers = usersData.length;
      const activeUsers = usersData.filter((u: any) => u.status === 'A').length;

      setData({
        totalNotices: notices?.length || 0,
        activeNotices: activeNotices.length,
        totalReads,
        readRate,
        totalUsers,
        activeUsers,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const safeNumber = (val: any): number => (isNaN(Number(val)) ? 0 : Number(val));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Insights and statistics about the notice system
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Notices"
            value={safeNumber(data.totalNotices)}
            subtitle={`${safeNumber(data.activeNotices)} active`}
            icon={FileText}
            variant="primary"
          />
          <StatsCard
            title="Total Reads"
            value={safeNumber(data.totalReads)}
            icon={Eye}
            variant="success"
          />
          <StatsCard
            title="Read Rate"
            value={`${safeNumber(data.readRate)}%`}
            subtitle="of active notices read"
            icon={TrendingUp}
            variant="warning"
          />
          <StatsCard
            title="Active Users"
            value={safeNumber(data.activeUsers)}
            subtitle={`of ${safeNumber(data.totalUsers)} total`}
            icon={Users}
            variant="default"
          />
        </div>

        <NoticesChart />

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Notice Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${(data.activeNotices / data.totalNotices) * 100 || 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{data.activeNotices}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Inactive/Expired</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-muted-foreground rounded-full"
                        style={{
                          width: `${((data.totalNotices - data.activeNotices) / data.totalNotices) * 100 || 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {data.totalNotices - data.activeNotices}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Users</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(data.activeUsers / data.totalUsers) * 100 || 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{data.activeUsers}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Inactive Users</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-muted-foreground rounded-full"
                        style={{
                          width: `${((data.totalUsers - data.activeUsers) / data.totalUsers) * 100 || 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {data.totalUsers - data.activeUsers}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;