import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import apiClient from '@/integrations/api/client';
import { 
  LogIn, 
  LogOut, 
  FileText, 
  Edit, 
  Trash2, 
  UserPlus,
  Activity as ActivityIcon
} from 'lucide-react';

interface ActivityLog {
  id: number;
  user_id: string;
  activity: string;
  details: string | null;
  created_at: string;
}

const activityIcons: Record<string, React.ElementType> = {
  login: LogIn,
  logout: LogOut,
  create: FileText,
  edit: Edit,
  delete: Trash2,
  registration: UserPlus,
};

const activityColors: Record<string, string> = {
  login: 'bg-green-500/10 text-green-600',
  logout: 'bg-muted text-muted-foreground',
  create: 'bg-primary/10 text-primary',
  edit: 'bg-accent/10 text-accent',
  delete: 'bg-destructive/10 text-destructive',
  registration: 'bg-blue-500/10 text-blue-600',
};

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await apiClient.activityLogs.list({ limit: 10 });
        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getIcon = (activity: string) => {
    const Icon = activityIcons[activity.toLowerCase()] || ActivityIcon;
    return Icon;
  };

  const getColor = (activity: string) => {
    return activityColors[activity.toLowerCase()] || 'bg-secondary text-secondary-foreground';
  };

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
          View All
        </Badge>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <ActivityIcon className="w-12 h-12 mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = getIcon(activity.activity);
                const colorClass = getColor(activity.activity);
                
                return (
                  <div key={activity.id} className="flex items-start gap-3 group">
                    <div className={`p-2.5 rounded-full ${colorClass} transition-transform group-hover:scale-110`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground capitalize">
                        {activity.activity}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.details}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.created_at ? format(new Date(activity.created_at), 'MMM d, yyyy h:mm a') : 'N/A'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;

