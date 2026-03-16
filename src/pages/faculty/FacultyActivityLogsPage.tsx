import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Activity, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FacultyLayout from '@/components/faculty/FacultyLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Log {
  id: string;
  activity: string;
  details: string | null;
  created_at: string;
}

const FacultyActivityLogsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      const { data } = await supabase
        .from('activity_logs')
        .select('id, activity, details, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      setLogs((data as Log[]) || []);
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

  return (
    <FacultyLayout>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
          <p className="text-muted-foreground mt-1">Your recent actions</p>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-faculty" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-faculty" />
              </div>
            ) : logs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No activity recorded yet</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/50"
                  >
                    <div className="p-1.5 rounded-full bg-faculty/10 mt-0.5">
                      <Activity className="w-3.5 h-3.5 text-faculty" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{log.activity}</p>
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
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

export default FacultyActivityLogsPage;
