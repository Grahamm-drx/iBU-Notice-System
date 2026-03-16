import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

interface FacultyHeaderProps {
  facultyName: string;
  avatarUrl?: string;
  draftCount?: number;
  onSignOut: () => void;
  onMenuClick: () => void;
  showMenuButton?: boolean;
}

const FacultyHeader = ({
  facultyName,
  avatarUrl,
  draftCount = 0,
  onSignOut,
  onMenuClick,
  showMenuButton,
}: FacultyHeaderProps) => {
  const initials = facultyName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <p className="font-semibold text-foreground">{facultyName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Draft indicator */}
        {draftCount > 0 && (
          <Link to="/faculty/notices">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              {draftCount} draft{draftCount !== 1 ? 's' : ''}
            </Button>
          </Link>
        )}

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border-2 border-faculty/30">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-faculty/10 text-faculty text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/faculty/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut} className="text-destructive">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default FacultyHeader;
