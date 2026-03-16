import { format } from 'date-fns';
import { AlertCircle, Bell, Calendar, Clock, Megaphone, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Notice {
  id: string;
  title: string;
  content: string;
  notice_type: 'general' | 'urgent' | 'academic' | 'event';
  priority: 'low' | 'normal' | 'high' | 'critical';
  publish_date: string | null;
  created_at: string;
  is_read?: boolean;
}

interface NoticeCardProps {
  notice: Notice;
  onClick?: () => void;
}

const NoticeCard = ({ notice, onClick }: NoticeCardProps) => {
  const typeIcons = {
    general: <Bell className="w-5 h-5" />,
    urgent: <AlertCircle className="w-5 h-5" />,
    academic: <Megaphone className="w-5 h-5" />,
    event: <Calendar className="w-5 h-5" />,
  };

  const typeColors = {
    general: 'bg-primary/10 text-primary border-primary/20',
    urgent: 'bg-destructive/10 text-destructive border-destructive/20',
    academic: 'bg-faculty/10 text-faculty border-faculty/20',
    event: 'bg-student/10 text-student border-student/20',
  };

  const priorityColors = {
    low: 'bg-muted text-muted-foreground',
    normal: 'bg-secondary text-secondary-foreground',
    high: 'bg-accent/10 text-accent',
    critical: 'bg-destructive text-destructive-foreground',
  };

  const typeGradients = {
    general: 'from-primary/10 to-primary/5',
    urgent: 'from-destructive/10 to-destructive/5',
    academic: 'from-faculty/10 to-faculty/5',
    event: 'from-student/10 to-student/5',
  };

  const date = notice.publish_date || notice.created_at;

  return (
    <Card
      className={`group cursor-pointer relative overflow-hidden bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1`}
      onClick={onClick}
    >
      {/* Hover gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${typeGradients[notice.notice_type]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Priority indicator line */}
{notice.priority === 'critical' && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-destructive to-destructive/50" />
      )}
{notice.priority === 'high' && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent" />
      )}

{notice.priority === 'normal' && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
      )}

      <CardHeader className="pb-2 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${typeColors[notice.notice_type]} border shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
              {typeIcons[notice.notice_type]}
            </div>
            <div>
              <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors duration-300">
                {notice.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {format(new Date(date), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`capitalize text-xs ${priorityColors[notice.priority]}`}>
              {notice.priority}
            </Badge>
            <Badge variant="outline" className="capitalize text-xs border-border/50 bg-card/50">
              {notice.notice_type}
            </Badge>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-muted-foreground line-clamp-2">{notice.content}</p>
      </CardContent>
    </Card>
  );
};

export default NoticeCard;
