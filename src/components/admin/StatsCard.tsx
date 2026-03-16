import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'warning' | 'success' | 'danger';
}

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: StatsCardProps) => {
  const variants = {
    default: 'from-secondary/80 to-secondary/40 text-foreground',
    primary: 'from-primary/20 to-primary/5 text-primary',
    warning: 'from-accent/20 to-accent/5 text-accent',
    success: 'from-green-500/20 to-green-500/5 text-green-600',
    danger: 'from-destructive/20 to-destructive/5 text-destructive',
  };

  const iconVariants = {
    default: 'bg-secondary text-foreground',
    primary: 'bg-primary/20 text-primary',
    warning: 'bg-accent/20 text-accent',
    success: 'bg-green-500/20 text-green-600',
    danger: 'bg-destructive/20 text-destructive',
  };

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl bg-gradient-to-br border border-border/50 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
      variants[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{typeof value === 'number' ? (isNaN(value) ? '0' : value.toLocaleString()) : String(value)}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              trend.isPositive ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', iconVariants[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-current opacity-5" />
    </div>
  );
};

export default StatsCard;
