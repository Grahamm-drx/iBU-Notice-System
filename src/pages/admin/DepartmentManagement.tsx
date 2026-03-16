import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Building2,
  FileText,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import apiClient from '@/integrations/api/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Department {
  id: string;
  code: string;
  name: string;
  status: string;
  created_at: string;
}

const DepartmentManagement = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    status: 'active',
  });
  const [saving, setSaving] = useState(false);
  const [noticeCountMap, setNoticeCountMap] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchDepartments();
    fetchNoticeCounts();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await apiClient.departments.list();
      setDepartments(data.map((d: any) => ({
        id: d.id.toString(),
        code: d.code,
        name: d.name,
        status: d.status === 'A' ? 'active' : 'inactive',
        created_at: d.created_at,
      })));
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load departments. Using MySQL backend.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNoticeCounts = async () => {
    try {
      const notices = await apiClient.notices.list();
      const counts: Record<string, number> = {};
      notices.forEach((notice: any) => {
        if (notice.department_id) {
          const deptId = notice.department_id.toString();
          counts[deptId] = (counts[deptId] || 0) + 1;
        }
      });
      setNoticeCountMap(counts);
    } catch (error) {
      console.error('Error fetching notice counts:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.code || !formData.name) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (editingDept) {
        await apiClient.departments.update(editingDept.id, {
          code: formData.code.toUpperCase(),
          name: formData.name,
          status: formData.status === 'active' ? 'A' : 'I'
        });
        const updatedList = await apiClient.departments.list();
        setDepartments(updatedList.map((d: any) => ({
          id: d.id.toString(),
          code: d.code,
          name: d.name,
          status: d.status === 'A' ? 'active' : 'inactive',
          created_at: d.created_at,
        })));
        toast({ title: 'Department updated successfully' });
      } else {
        const newDept = await apiClient.departments.create({
          code: formData.code.toUpperCase(),
          name: formData.name,
        });
        const list = await apiClient.departments.list();
        setDepartments(list.map((d: any) => ({
          id: d.id.toString(),
          code: d.code,
          name: d.name,
          status: d.status === 'A' ? 'active' : 'inactive',
          created_at: d.created_at,
        })));
        toast({ title: 'Department created successfully' });
      }

      setShowModal(false);
      setEditingDept(null);
      setFormData({ code: '', name: '', status: 'active' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to save department',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (dept: Department) => {
    setFormData({
      code: dept.code,
      name: dept.name,
      status: dept.status,
    });
    setEditingDept(dept);
    setShowModal(true);
  };

  const handleToggleStatus = async (dept: Department) => {
    const newStatus = dept.status === 'active' ? 'inactive' : 'active';
    const dbStatus = newStatus === 'active' ? 'A' : 'I';
    try {
      await apiClient.departments.update(dept.id, { status: dbStatus });
      const list = await apiClient.departments.list();
      setDepartments(list.map((d: any) => ({
        id: d.id.toString(),
        code: d.code,
        name: d.name,
        status: d.status === 'A' ? 'active' : 'inactive',
        created_at: d.created_at,
      })));
      toast({ title: `Department ${newStatus === 'active' ? 'activated' : 'deactivated'}` });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update department status',
        variant: 'destructive',
      });
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.status !== 'I' && (
      dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Department Management</h1>
          <p className="text-muted-foreground">Manage university departments</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Department
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Code</TableHead>
              <TableHead>Department Name</TableHead>
              <TableHead>Notices</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <div className="h-12 animate-pulse bg-muted rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredDepartments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Building2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No departments found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredDepartments.map((dept) => (
                <TableRow key={dept.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-mono font-bold text-primary">{dept.code}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      {noticeCountMap[dept.id] || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={dept.status === 'active'}
                        onCheckedChange={() => handleToggleStatus(dept)}
                      />
                      <Badge
                        variant="outline"
                        className={cn(
                          dept.status === 'active'
                            ? 'bg-green-500/10 text-green-600 border-green-500/20'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {dept.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
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
                        <DropdownMenuItem onClick={() => handleEdit(dept)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          View Notices
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={showModal} onOpenChange={(open) => {
        setShowModal(open);
        if (!open) {
          setEditingDept(null);
          setFormData({ code: '', name: '', status: 'active' });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDept ? 'Edit Department' : 'Add Department'}</DialogTitle>
            <DialogDescription>
              {editingDept
                ? 'Update department information'
                : 'Create a new department for the university'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Department Code *</Label>
              <Input
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                placeholder="e.g. CSD"
                maxLength={10}
              />
            </div>
            <div className="space-y-2">
              <Label>Department Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Computer Science Department"
              />
            </div>
            {editingDept && (
              <div className="flex items-center justify-between">
                <Label>Active Status</Label>
                <Switch
                  checked={formData.status === 'active'}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked ? 'active' : 'inactive' })
                  }
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingDept ? (
                'Update'
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentManagement;
