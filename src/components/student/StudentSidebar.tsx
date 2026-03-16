import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  User,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import IBuLogo from '@/components/iBU-Logo';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/student/dashboard' },
  { icon: Bell, label: 'All Notices', path: '/student/notices' },
  { icon: AlertTriangle, label: 'Urgent Notices', path: '/student/urgent', badgeVariant: 'destructive' },
  { icon: Building2, label: 'My Department', path: '/student/department' },
  { icon: CheckCircle2, label: 'Read Tracking', path: '/student/tracking' },
  { icon: User, label: 'My Profile', path: '/student/profile' },
];

interface StudentSidebarProps {
  urgentCount?: number;
  unreadCount?: number;
  collapsed: boolean;
  onToggle: () => void;
}

const StudentSidebar = ({
  urgentCount = 0,
  unreadCount = 0,
  collapsed,
  onToggle,
}: StudentSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Update navItems with actual counts
  const updatedNavItems = navItems.map((item) => {
    if (item.path === '/student/notices' && unreadCount > 0) {
      return { ...item, badge: unreadCount };
    }
    if (item.path === '/student/urgent' && urgentCount > 0) {
      return { ...item, badge: urgentCount };
    }
    return item;
  });

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card/95 backdrop-blur-xl border-r border-border/50 transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Logo Section */}
      <div
        className={cn(
          'h-16 flex items-center border-b border-border/50 px-4',
          collapsed ? 'justify-center' : 'justify-center'
        )}
      >
        {!collapsed && <IBuLogo />}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-student flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-student-foreground" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-card shadow-md hover:bg-secondary"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-student/10 to-student/5 border border-student/20">
            <div className="w-10 h-10 rounded-full bg-student/20 flex items-center justify-center">
              <span className="text-student font-bold text-sm">
                {profile?.full_name?.charAt(0) || 'S'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">
                {profile?.full_name || 'Student'}
              </p>
              <p className="text-xs text-muted-foreground">Student Account</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {updatedNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          if (collapsed) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center justify-center h-12 w-full rounded-xl transition-all duration-200',
                      active
                        ? 'bg-student text-student-foreground shadow-lg shadow-student/25'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                active
                  ? 'bg-student text-student-foreground shadow-lg shadow-student/25'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-1'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform',
                  !active && 'group-hover:scale-110'
                )}
              />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'ml-auto text-xs px-2 py-0.5 rounded-full',
                    item.badgeVariant === 'destructive'
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-student/20 text-student'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-3 border-t border-border/50">
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="w-full h-12 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign Out</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start gap-3 px-4 py-3 h-auto rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </Button>
        )}
      </div>
    </aside>
  );
};

export default StudentSidebar;

