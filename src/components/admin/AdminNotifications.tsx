import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { useAdminNotifications, type AdminNotification } from '@/hooks/useAdminNotifications';
import { useNavigate } from 'react-router-dom';

const AdminNotifications = () => {
  const { notifications, notificationCount, loading } = useAdminNotifications();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96">
        <DropdownMenuLabel className="flex items-center justify-between pb-2">
          Notifications
          <Badge variant="secondary" className="text-xs">
            {notificationCount} new
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className={`p-3 cursor-pointer flex-col items-start gap-1 ${notification.isUrgent ? 'bg-destructive/10 border-l-4 border-destructive/50' : ''}`}>
              <p className="font-medium text-sm line-clamp-1">
                {notification.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {notification.time}
              </p>
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full capitalize">
                {notification.type}
              </span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-primary hover:bg-accent/50 cursor-pointer">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminNotifications;

