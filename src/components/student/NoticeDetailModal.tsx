import { format } from 'date-fns';
import { Download, Calendar, Clock, User, Building2, AlertCircle, Pin, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Notice {
  id: string;
  title: string;
  content: string;
  notice_type: 'general' | 'urgent' | 'academic' | 'event';
  priority: 'low' | 'normal' | 'high' | 'critical';
  category: 'exam' | 'events' | 'class' | 'general' | null;
  publish_date: string | null;
  expire_date: string | null;
  created_at: string;
  is_pinned: boolean;
  attachment_url: string | null;
  author?: {
    full_name: string;
  };
  department?: {
    name: string;
    code: string;
  };
}

interface NoticeDetailModalProps {
  notice: Notice | null;
  isOpen: boolean;
  onClose: () => void;
  isRead: boolean;
  readAt?: string | null;
  onMarkAsRead: () => void;
}

const NoticeDetailModal = ({
  notice,
  isOpen,
  onClose,
  isRead,
  readAt,
  onMarkAsRead,
}: NoticeDetailModalProps) => {
  if (!notice) return null;

  const priorityColors = {
    low: 'bg-muted text-muted-foreground',
    normal: 'bg-secondary text-secondary-foreground',
    high: 'bg-accent/20 text-accent-foreground border border-accent/30',
    critical: 'bg-destructive text-destructive-foreground',
  };

  const categoryColors = {
    exam: 'bg-primary/10 text-primary border-primary/20',
    events: 'bg-green-500/10 text-green-600 border-green-500/20',
    class: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    general: 'bg-secondary text-secondary-foreground border-secondary',
  };

  const typeColors = {
    general: 'bg-primary/10 text-primary',
    urgent: 'bg-destructive/10 text-destructive',
    academic: 'bg-faculty/10 text-faculty',
    event: 'bg-student/10 text-student',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {notice.is_pinned && (
              <Badge variant="outline" className="gap-1">
                <Pin className="w-3 h-3" />
                Pinned
              </Badge>
            )}
            <Badge className={typeColors[notice.notice_type]}>
              {notice.notice_type}
            </Badge>
            <Badge className={priorityColors[notice.priority]}>
              {notice.priority} priority
            </Badge>
            {notice.category && (
              <Badge variant="outline" className={categoryColors[notice.category]}>
                {notice.category}
              </Badge>
            )}
          </div>

          {/* Title */}
          <DialogTitle className="text-2xl font-bold leading-tight">
            {notice.title}
          </DialogTitle>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
            {notice.author?.full_name && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{notice.author.full_name}</span>
              </div>
            )}
            {notice.department && (
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>
                  {notice.department.code} - {notice.department.name}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>
                Posted{' '}
                {format(
                  new Date(notice.publish_date || notice.created_at),
                  'MMMM d, yyyy'
                )}
              </span>
            </div>
            {notice.expire_date && (
              <div className="flex items-center gap-1.5 text-destructive">
                <Clock className="w-4 h-4" />
                <span>
                  Expires {format(new Date(notice.expire_date), 'MMMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        {/* Content */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap text-foreground leading-relaxed">
            {notice.content}
          </p>
        </div>

        {/* Attachment */}
        {notice.attachment_url && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Attachment</h4>
              <Button variant="outline" asChild className="gap-2">
                <a
                  href={notice.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-4 h-4" />
                  Download Attachment
                </a>
              </Button>
            </div>
          </>
        )}

        <Separator className="my-4" />

        {/* Read status */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {isRead ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>
                  Read on{' '}
                  {readAt
                    ? format(new Date(readAt), 'MMMM d, yyyy h:mm a')
                    : 'recently'}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">Not read yet</span>
            )}
          </div>
          {!isRead && (
            <Button onClick={onMarkAsRead} size="sm" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Mark as Read
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoticeDetailModal;
