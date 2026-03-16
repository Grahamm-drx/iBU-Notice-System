import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  Home,
  LogOut,
  Menu,
  Plus,
  Settings,
  User,
  Users,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import IBuLogo from './iBU-Logo';

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'student' | 'faculty' | 'admin';
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const roleColors = {
    student: 'bg-student text-student-foreground',
    faculty: 'bg-faculty text-faculty-foreground',
    admin: 'bg-admin text-admin-foreground',
  };

  const roleIcons = {
    student: <GraduationCap className="w-5 h-5" />,
    faculty: <Users className="w-5 h-5" />,
    admin: <Settings className="w-5 h-5" />,
  };

  const navItems = {
    student: [
      { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/student/dashboard' },
      { icon: <Bell className="w-5 h-5" />, label: 'Notices', path: '/student/notices' },
      { icon: <User className="w-5 h-5" />, label: 'Profile', path: '/student/profile' },
    ],
    faculty: [
      { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/faculty/dashboard' },
      { icon: <FileText className="w-5 h-5" />, label: 'My Notices', path: '/faculty/notices' },
      { icon: <Plus className="w-5 h-5" />, label: 'Create Notice', path: '/faculty/notices/create' },
      { icon: <User className="w-5 h-5" />, label: 'Profile', path: '/faculty/profile' },
    ],
    admin: [
      { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: <FileText className="w-5 h-5" />, label: 'All Notices', path: '/admin/notices' },
      { icon: <Users className="w-5 h-5" />, label: 'Users', path: '/admin/users' },
      { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' },
    ],
  };

  const NavContent = () => (
    <nav className="space-y-1.5">
      {navItems[role].map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
            location.pathname === item.path
              ? `${roleColors[role]} shadow-lg shadow-primary/20`
              : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground hover:translate-x-1'
          }`}
        >
          <span className={`transition-transform duration-300 ${location.pathname !== item.path ? 'group-hover:scale-110' : ''}`}>
            {item.icon}
          </span>
          <span className="font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-float-medium" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float-fast" />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 z-50 px-4 flex items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-secondary/80">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6 bg-card/95 backdrop-blur-xl border-r border-border/50">
            <div className="mb-8">
              <IBuLogo />
            </div>
            <NavContent />
            <div className="absolute bottom-6 left-6 right-6">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 rounded-xl border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-300"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <IBuLogo />
        <div className={`p-2 rounded-xl ${roleColors[role]} shadow-lg`}>
          {roleIcons[role]}
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:flex lg:flex-col lg:w-72 lg:h-screen lg:bg-card/80 lg:backdrop-blur-xl lg:border-r lg:border-border/50 lg:p-6">
        <div className="mb-8">
          <iBULogo />
        </div>
        
        <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 border border-border/30 shadow-sm`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${roleColors[role]} shadow-lg`}>
              {roleIcons[role]}
            </div>
            <div>
              <p className="font-semibold text-card-foreground">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-sm text-muted-foreground capitalize">{role}</p>
            </div>
          </div>
        </div>

        <NavContent />

        <div className="mt-auto">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 rounded-xl border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-300"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-20 lg:pt-8 p-4 lg:p-8 relative z-10">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
