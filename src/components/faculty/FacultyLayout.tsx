import { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/integrations/api/client';
import FacultySidebar from './FacultySidebar';
import FacultyHeader from './FacultyHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notice {
  id: number;
  is_published: boolean;
}

interface FacultyLayoutProps {
  children: ReactNode;
}

const FacultyLayout = ({ children }: FacultyLayoutProps) => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [noticeCount, setNoticeCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchCounts = async () => {
      try {
        const notices = await apiClient.notices.list({ author_id: user.id });
        const drafts = notices.filter((n: Notice) => !n.is_published);
        setNoticeCount(notices.length);
        setDraftCount(drafts.length);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-faculty/5">
        <Loader2 className="w-8 h-8 animate-spin text-faculty" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-faculty/5">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-faculty/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-float-medium" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-faculty/5 rounded-full blur-3xl animate-float-fast" />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-card/95 backdrop-blur-xl">
          <FacultySidebar
            noticeCount={noticeCount}
            collapsed={false}
            onToggle={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <FacultySidebar
          noticeCount={noticeCount}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Main Content */}
      <div className={cn('transition-all duration-300', collapsed ? 'lg:ml-20' : 'lg:ml-72')}>
        <FacultyHeader
          facultyName={profile?.full_name || 'Faculty'}
          avatarUrl={profile?.avatar_url || undefined}
          draftCount={draftCount}
          onSignOut={handleSignOut}
          onMenuClick={() => setMobileOpen(true)}
          showMenuButton
        />
        <main className="p-4 lg:p-8 relative z-10">{children}</main>
      </div>
    </div>
  );
};

export default FacultyLayout;

