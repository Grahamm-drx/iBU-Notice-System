import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Search,
  LogIn,
  LogOut,
  FileText,
  Edit,
  Trash2,
  UserPlus,
  Activity as ActivityIcon,
  Filter,
  Calendar,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import apiClient from '@/integrations/api/client';
import { cn } from '@/lib/utils';

interface ActivityLog {
  id: string;
  user_id: string;
  activity: string;
  details: string | null;
  ip_address: string | null;
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
  login: 'bg-green-500/10 text-green-600 border-green-500/20',
  logout: 'bg-muted text-muted-foreground border-border',
  create: 'bg-primary/10 text-primary border-primary/20',
  edit: 'bg-accent/10 text-accent border-accent/20',
  delete: 'bg-destructive/10 text-destructive border-destructive/20',
  registration: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await apiClient.activityLogs.list({ limit: '100' });
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (activity: string) => {
    return activityIcons[activity.toLowerCase()] || ActivityIcon;
  };

  const getColor = (activity: string) => {
    return activityColors[activity.toLowerCase()] || 'bg-secondary text-secondary-foreground border-border';
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActivity =
      activityFilter === 'all' || log.activity.toLowerCase() === activityFilter;
    
    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && new Date(log.created_at) >= dateFrom;
    }
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && new Date(log.created_at) <= endOfDay;
    }

    return matchesSearch && matchesActivity && matchesDate;
  });

  const uniqueActivities = [...new Set(logs.map((l) => l.activity.toLowerCase()))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
        <p className="text-muted-foreground">Monitor all system activity and user actions</p>
      </div>

      {/* Filters */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                {uniqueActivities.map((act) => (
                  <SelectItem key={act} value={act} className="capitalize">
                    {act}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  {dateFrom ? format(dateFrom, 'MMM d') : 'From'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  {dateTo ? format(dateTo, 'MMM d') : 'To'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {(dateFrom || dateTo || activityFilter !== 'all') && (
              <Button
                variant="ghost"
                onClick={() => {
                  setDateFrom(undefined);
                  setDateTo(undefined);
                  setActivityFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
            <Button
              variant="outline"
              onClick={fetchLogs}
              className="gap-2"
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="min-w-[140px]">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(10)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={4}>
                        <div className="h-12 animate-pulse bg-muted rounded" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <ActivityIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No activity logs found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => {
                    const Icon = getIcon(log.activity);
                    const colorClass = getColor(log.activity);

                    return (
                      <TableRow key={log.id} className="group">
                        <TableCell className="text-muted-foreground">
                          <div className="text-sm">
                            {format(new Date(log.created_at), 'MMM d, yyyy')}
                          </div>
                          <div className="text-xs">
                            {format(new Date(log.created_at), 'h:mm:ss a')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('gap-1 capitalize', colorClass)}>
                            <Icon className="w-3 h-3" />
                            {log.activity}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="text-sm truncate">{log.details || '-'}</p>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm">
                          {log.ip_address || '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogs;
