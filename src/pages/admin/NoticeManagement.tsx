import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Pin,
  PinOff,
  Download,
  FileText,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import apiClient from '@/integrations/api/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

  interface Notice {
    id: string;
    title: string;
    content: string;
    category: string | null;
    priority: string;
    notice_type: string;
    is_published: boolean;
    is_pinned: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    expire_date: string | null;
    department_id: string | null;
    target_departments: string[] | null;
    block_id: string | null;
    block_dept_code: string | null;
    subject_id: string | null;
    target_type: string;
    author_id: string;
  }

interface Department {
  id: string;
  code: string;
  name: string;
}

const categoryColors: Record<string, string> = {
  exam: 'bg-primary/10 text-primary border-primary/20',
  events: 'bg-green-500/10 text-green-600 border-green-500/20',
  class: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
  general: 'bg-muted text-muted-foreground border-border',
};

const priorityIndicators: Record<string, string> = {
  'Urgent': 'bg-destructive',
  'Normal': 'bg-primary',
};

const statusBadges: Record<string, { color: string; icon: React.ElementType }> = {
  published: { color: 'bg-green-500/10 text-green-600', icon: CheckCircle2 },
  draft: { color: 'bg-muted text-muted-foreground', icon: Clock },
  active: { color: 'bg-green-500/10 text-green-600', icon: CheckCircle2 },
  expired: { color: 'bg-destructive/10 text-destructive', icon: XCircle },
};

const deptColors: Record<string, string> = {
  'CSD': 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  'EDUC': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'NURSING': 'bg-green-500/10 text-green-600 border-green-500/20',
  'CENG': 'bg-red-500/10 text-red-600 border-red-500/20',
  'ENTREP': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'TECH': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
};

const NoticeManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotices, setSelectedNotices] = useState<string[]>([]);
  const [previewNotice, setPreviewNotice] = useState<Notice | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchNotices();
  }, [searchQuery, categoryFilter, priorityFilter, departmentFilter, statusFilter]);

  useEffect(() => {
    fetchDepartments();
    fetchBlocks();
  }, []);


  const fetchNotices = async () => {
    try {
      const params: Record<string, string> = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (departmentFilter !== 'all') params.department_id = departmentFilter;
      if (statusFilter !== 'all') params.status = statusFilter.toUpperCase();
      if (searchQuery) params.search = searchQuery;

      const apiNotices = await apiClient.notices.list(params);
        const mappedNotices = apiNotices.map((n: any) => ({
          id: n.id.toString(),
          title: n.title,
          content: n.content,
          category: n.category,
          priority: n.priority,
          author_id: n.author_id,
          created_at: n.created_at,
          updated_at: n.updated_at,
          expire_date: n.expire_date,
          department_id: n.department_id,
          target_departments: n.target_departments || [],
          block_id: n.block_id,
          block_dept_code: n.block_dept_code,
          subject_id: n.subject_id,
          target_type: n.target_type || 'All',
          is_published: n.is_published,
          is_pinned: n.is_pinned,
        }));
      setNotices(mappedNotices);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notices',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const depts = await apiClient.departments.list();
      setDepartments(depts.map((d: any) => ({
        id: d.id.toString(),
        code: d.code,
        name: d.name,
      })));
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchBlocks = async () => {
    try {
      const blks = await apiClient.blocks.list();
      setBlocks(blks);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.notices.delete(parseInt(id));
      setNotices(notices.filter((n) => n.id !== id));
      toast({ title: 'Notice deleted successfully' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete notice',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePin = async (notice: Notice) => {
    try {
      await apiClient.notices.update(parseInt(notice.id), { is_pinned: !notice.is_pinned });
      setNotices(
        notices.map((n) =>
          n.id === notice.id ? { ...n, is_pinned: !n.is_pinned } : n
        )
      );
      toast({ title: notice.is_pinned ? 'Notice unpinned' : 'Notice pinned' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notice',
        variant: 'destructive',
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedNotices) {
        await apiClient.notices.delete(parseInt(id));
      }
      setNotices(notices.filter((n) => !selectedNotices.includes(n.id)));
      setSelectedNotices([]);
      toast({ title: `${selectedNotices.length} notices deleted` });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete notices',
        variant: 'destructive',
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedNotices.length === filteredNotices.length) {
      setSelectedNotices([]);
    } else {
      setSelectedNotices(filteredNotices.map((n) => n.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedNotices((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getDepartmentName = (id: any) => {
    const strId = id?.toString();
    const dept = departments.find((d) => d.id.toString() === strId);
    return dept?.code || 'Unknown';
  };

  const getBlockDepartment = (blockId: any) => {
    if (!blockId) return 'CSD';
    const strId = blockId.toString();
    const block = blocks.find((b: any) => b.id === strId);
    return block ? block.department_code || block.department_name?.substring(0,3) || 'CSD' : 'CSD';
  };

  const getStatus = (notice: Notice): string => {
    if (!notice.is_published) return 'draft';
    if (notice.expire_date && new Date(notice.expire_date) < new Date()) return 'expired';
    return 'active';
  };

  // No client-side filtering - trust backend params
  const filteredNotices = notices;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notice Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage all notices</p>
        </div>
        <Button onClick={() => navigate('/admin/notices/create')} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Notice
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>

                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>

              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedNotices.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center justify-between">
            <p className="text-sm font-medium">
              {selectedNotices.length} notice(s) selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedNotices.length === filteredNotices.length && filteredNotices.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-2"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Department(s)</TableHead>
              <TableHead className="text-center">Created</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}>
                    <div className="h-12 animate-pulse bg-muted rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredNotices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No notices found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredNotices.map((notice) => {
                const status = getStatus(notice);
                const StatusIcon = statusBadges[status]?.icon || Clock;

                return (
                  <TableRow
                    key={notice.id}
                    className={cn(
                      'group transition-colors',
                      notice.priority === 'Urgent' && 'bg-destructive/5'
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedNotices.includes(notice.id)}
                        onCheckedChange={() => toggleSelect(notice.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          'w-1 h-10 rounded-full',
                          priorityIndicators[notice.priority] || priorityIndicators.normal
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {notice.is_pinned && (
                          <Pin className="w-4 h-4 text-accent fill-accent" />
                        )}
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">
                            {notice.title}
                          </p>
                          {notice.priority === 'Urgent' && (
                            <div className="flex items-center gap-1 text-xs text-destructive">
                              <AlertTriangle className="w-3 h-3" />
                              Urgent
                            </div>
                          )}

                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          'capitalize',
                          categoryColors[notice.category || 'general']
                        )}
                      >
                        {notice.category || 'general'}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      {notice.target_type === 'Department' && notice.department_id ? (
                        <Badge variant="outline" className={cn('capitalize', deptColors[getDepartmentName(notice.department_id)] || 'bg-muted')}>
                          {getDepartmentName(notice.department_id)}
                        </Badge>
                      ) : notice.target_type === 'Block' ? (
                        <Badge variant="outline" className={cn('capitalize', deptColors[getBlockDepartment(notice.block_id)] || 'bg-muted')}>
                          {getBlockDepartment(notice.block_id)}
                        </Badge>
                      ) : notice.target_type === 'Program' ? (
                        <Badge variant="secondary">
                          Program
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          {notice.target_type || 'All'}
                        </Badge>
                      )}

                    </TableCell>

                    <TableCell className="text-center">
                      <div className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(notice.created_at), 'MMM d, yyyy')}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn('capitalize gap-1', statusBadges[status]?.color)}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setPreviewNotice(notice)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/notices/edit/${notice.id}`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePin(notice)}>
                            {notice.is_pinned ? (
                              <>
                                <PinOff className="w-4 h-4 mr-2" />
                                Unpin
                              </>
                            ) : (
                              <>
                                <Pin className="w-4 h-4 mr-2" />
                                Pin to Top
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(notice.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Preview Modal */}
      <Dialog open={!!previewNotice} onOpenChange={() => setPreviewNotice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewNotice?.is_pinned && (
                <Pin className="w-5 h-5 text-accent fill-accent" />
              )}
              {previewNotice?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={cn(
                  'capitalize',
                  categoryColors[previewNotice?.category || 'general']
                )}
              >
                {previewNotice?.category || 'general'}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  priorityIndicators[previewNotice?.priority || 'normal'],
                  'text-white'
                )}
              >
                {previewNotice?.priority}
              </Badge>
            </div>
            <div className="prose prose-sm max-w-none">
              <p>{previewNotice?.content}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                Created: {previewNotice && format(new Date(previewNotice.created_at), 'PPpp')}
              </p>
              {previewNotice?.expire_date && (
                <p>Expires: {format(new Date(previewNotice.expire_date), 'PPpp')}</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoticeManagement;

