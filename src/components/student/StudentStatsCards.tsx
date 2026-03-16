import { AlertTriangle, Bell, BookOpen, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardsProps {
  totalNotices: number;
  unreadCount: number;
  urgentCount: number;
  academicCount: number;
  readPercentage: number;
}

const StudentStatsCards = ({
  totalNotices,
  unreadCount,
  urgentCount,
  academicCount,
  readPercentage,
}: StatsCardsProps) => {
  const stats = [
    {
      label: 'Total Notices',
      value: totalNotices,
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-primary/10 text-primary',
      gradient: 'from-primary/10 to-primary/5',
    },
    {
      label: 'Unread',
      value: unreadCount,
      icon: <Bell className="w-6 h-6" />,
      color: 'bg-accent/10 text-accent',
      gradient: 'from-accent/10 to-accent/5',
    },
    {
      label: 'Urgent',
      value: urgentCount,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-destructive/10 text-destructive',
      gradient: 'from-destructive/10 to-destructive/5',
    },
    {
      label: 'Academic',
      value: academicCount,
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-faculty/10 text-faculty',
      gradient: 'from-faculty/10 to-faculty/5',
    },
    {
      label: 'Read Rate',
      value: `${readPercentage}%`,
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: 'bg-green-500/10 text-green-600',
      gradient: 'from-green-500/10 to-green-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className="group relative overflow-hidden bg-card/60 backdrop-blur-sm border-border/30 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${stat.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudentStatsCards;
