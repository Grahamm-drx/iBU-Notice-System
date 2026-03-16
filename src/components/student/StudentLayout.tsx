import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import StudentSidebar from './StudentSidebar';
import StudentHeader from './StudentHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications, type Notification } from '@/hooks/useNotifications';

interface StudentLayoutProps {
  children: ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    notifications,
    urgentCount,
    unreadCount,
  } = useNotifications();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-student/5">
        <Loader2 className="w-8 h-8 animate-spin text-student" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-student/5">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-student/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-float-medium" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-student/5 rounded-full blur-3xl animate-float-fast" />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-card/95 backdrop-blur-xl">
          <StudentSidebar
            urgentCount={urgentCount}
            unreadCount={unreadCount}
            collapsed={false}
            onToggle={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <StudentSidebar
          urgentCount={urgentCount}
          unreadCount={unreadCount}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300',
          collapsed ? 'lg:ml-20' : 'lg:ml-72'
        )}
      >
        <StudentHeader
          studentName={profile?.full_name || 'Student'}
          avatarUrl={profile?.avatar_url || undefined}
          urgentCount={urgentCount}
          notifications={notifications}
          onSignOut={handleSignOut}
          onMenuClick={() => setMobileOpen(true)}
          showMenuButton
        />

        <main className="p-4 lg:p-8 relative z-10">{children}</main>
      </div>
    </div>
  );
};

export default StudentLayout;

