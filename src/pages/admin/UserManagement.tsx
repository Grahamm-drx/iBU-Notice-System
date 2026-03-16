import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCog,
  Mail,
  Shield,
  GraduationCap,
  Users as UsersIcon,
  Loader2,
  X,
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
  DropdownMenuSeparator,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import apiClient from '@/integrations/api/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  department_id: string | null;
  batch_year: number | null;
  status: string;
  last_login: string | null;
  created_at: string;
  role: 'admin' | 'faculty' | 'student';
}

interface Department {
  id: string;
  code: string;
  name: string;
}

const roleColors: Record<string, string> = {
  student: 'bg-student/10 text-student border-student/20',
  faculty: 'bg-faculty/10 text-faculty border-faculty/20',
  admin: 'bg-admin/10 text-admin border-admin/20',
};

const roleIcons: Record<string, React.ElementType> = {
  student: GraduationCap,
  faculty: UsersIcon,
  admin: Shield,
};

const deptColors: Record<string, string> = {
  'CSD': 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  'EDUC': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'NURSING': 'bg-green-500/10 text-green-600 border-green-500/20',
  'CENG': 'bg-red-500/10 text-red-600 border-red-500/20',
  'ENTREP': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'TECH': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
};

const UserManagement = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'student' as 'student' | 'faculty' | 'admin',
    departmentId: '',
    batchYear: '',
    status: 'active',
  });
  const [saving, setSaving] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'student' as 'student' | 'faculty' | 'admin',
    departmentId: '',
    batchYear: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, deptsRes] = await Promise.all([
        apiClient.users.list(),
        apiClient.departments.list(),
      ]);
      setProfiles(usersRes.map((u: any) => ({
        id: u.id,
        user_id: u.user_id,
        email: u.email,
        full_name: u.full_name,
        department_id: u.department_id,
        batch_year: u.batch_year,
        status: u.status === 'A' ? 'active' : 'inactive',
        last_login: u.last_login,
        created_at: u.created_at,
        role: u.role,
      })));
      setDepartments(deptsRes.map((d: any) => ({
        id: d.id.toString(),
        code: d.code,
        name: d.name,
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = (userId: string) => {
    const user = profiles.find(p => p.user_id === userId);
    return user?.role || 'student';
  };

const getDepartmentName = (deptId: string | null) => {
    if (!deptId) return '-';
    const dept = departments.find((d) => d.id === deptId.toString());
    return dept ? dept.code : '-';
  };

  const getUserId = (profile: UserProfile) => {
    return profile.user_id;
  };

  const handleUpdateStatus = async (profile: UserProfile, newStatus: string) => {
    const dbStatus = newStatus === 'active' ? 'A' : 'I';
    try {
      await apiClient.users.update(profile.id, { status: dbStatus });
      setProfiles(profiles.map((p) =>
        p.id === profile.id ? { ...p, status: newStatus } : p
      ));
      toast({ title: `User ${newStatus === 'active' ? 'activated' : 'deactivated'}` });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'student' | 'faculty' | 'admin') => {
    const dbRole = newRole.charAt(0).toUpperCase() + newRole.slice(1);
    try {
      await apiClient.users.update(userId, { role: dbRole });
      setProfiles(profiles.map((p) =>
        p.user_id === userId ? { ...p, role: newRole } : p
      ));
      toast({ title: `Role updated to ${newRole}` });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update role',
        variant: 'destructive',
      });
    }
  };

  const handleEditUser = (profile: UserProfile) => {
    setFormData({
      fullName: profile.full_name,
      role: profile.role,
      departmentId: profile.department_id || '',
      batchYear: profile.batch_year?.toString() || '',
      status: profile.status,
    });
    setEditingUser(profile);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    setSaving(true);
    try {
      const dbStatus = formData.status === 'active' ? 'A' : 'I';
      await apiClient.users.update(editingUser.id, {
        full_name: formData.fullName,
        department_id: formData.departmentId || null,
        role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1),
        status: dbStatus,
      });
      
      const updatedList = await apiClient.users.list();
      setProfiles(updatedList.map((u: any) => ({
        id: u.id,
        user_id: u.user_id,
        email: u.email,
        full_name: u.full_name,
        department_id: u.department_id,
        batch_year: u.batch_year,
        status: u.status === 'A' ? 'active' : 'inactive',
        last_login: u.last_login,
        created_at: u.created_at,
        role: u.role,
      })));

      setEditingUser(null);
      toast({ title: 'User updated successfully' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUser = async () => {
    setSaving(true);
    try {
      const roleDB = newUserForm.role.charAt(0).toUpperCase() + newUserForm.role.slice(1);
      
      const safeBatchYear = newUserForm.batchYear ? parseInt(newUserForm.batchYear) || null : null;
      const safeDepartmentId = newUserForm.departmentId || null;
      
      const newUser = await apiClient.auth.register(
        newUserForm.email,
        newUserForm.password,
        newUserForm.fullName,
        newUserForm.role,
        safeDepartmentId,
        safeBatchYear
      );
      
      // Auto-enroll student if student role + block/dept selected
      if (newUserForm.role === 'student' && newUserForm.departmentId) {
        const blocks = await apiClient.blocks.list();
        const studentBlock = blocks.find(b => b.department_id === parseInt(newUserForm.departmentId || '')) || blocks[0];
        
        if (studentBlock) {
          await apiClient.students.enroll({
            student_id: newUser.user.id || newUser.id,
            block_id: parseInt(studentBlock.id),
            semester: '1st',
            school_year: '2025-2026',
          });
        }
      }
      
      // Refresh list
      const updatedList = await apiClient.users.list();
      setProfiles(updatedList.map((u: any) => ({
        id: u.id,
        user_id: u.user_id,
        email: u.email,
        full_name: u.full_name,
        department_id: u.department_id,
        batch_year: u.batch_year,
        status: u.status === 'A' ? 'active' : 'inactive',
        last_login: u.last_login,
        created_at: u.created_at,
        role: u.role,
      })));

      setIsAddingNew(false);
      setNewUserForm({
        email: '',
        password: '',
        fullName: '',
        role: 'student',
        departmentId: '',
        batchYear: '',
      });
      toast({ title: 'User created successfully' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    const role = getUserRole(profile.user_id);
    const matchesSearch =
      profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || role === roleFilter;
    const matchesDept = departmentFilter === 'all' || profile.department_id?.toString() === departmentFilter;
    const matchesStatus = statusFilter === 'all' || profile.status === statusFilter;

    return matchesSearch && matchesRole && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage all system users and their roles</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
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
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-center">User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Department</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Joined</TableHead>
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
            ) : filteredProfiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <UsersIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No users found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredProfiles.map((profile, index) => {
                const role = getUserRole(profile.user_id);
                const RoleIcon = roleIcons[role] || GraduationCap;

                return (
                  <TableRow key={profile.id} className="group">
              <TableCell className="text-center font-mono text-sm">
                      {getUserId(profile)}

                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center',
                          roleColors[role]
                        )}>
                          <RoleIcon className="w-4 h-4" />
                        </div>
                        <span className="font-medium">
                          {profile.full_name || 'Unknown'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {profile.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn('capitalize', roleColors[role])}>
                        {role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn('capitalize', deptColors[getDepartmentName(profile.department_id)] || 'bg-muted')}>
                        {getDepartmentName(profile.department_id)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          profile.status === 'active'
                            ? 'bg-green-500/10 text-green-600 border-green-500/20'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {profile.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {format(new Date(profile.created_at), 'MMM d, yyyy')}
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
                          <DropdownMenuItem onClick={() => handleEditUser(profile)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCog className="w-4 h-4 mr-2" />
                            View Activity
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatus(
                                profile,
                                profile.status === 'active' ? 'inactive' : 'active'
                              )
                            }
                          >
                            {profile.status === 'active' ? 'Deactivate' : 'Activate'}
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

      {/* Edit & Add User Modals */}
      <Dialog open={editingUser !== null || isAddingNew} onOpenChange={() => {
        setEditingUser(null);
        setIsAddingNew(false);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>{editingUser ? 'Update user information and permissions' : 'Create a new system user account'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{editingUser ? 'Full Name' : 'Full Name *'}</Label>
              <Input
                value={editingUser ? formData.fullName : newUserForm.fullName}
                onChange={(e) => editingUser 
                  ? setFormData({ ...formData, fullName: e.target.value })
                  : setNewUserForm({ ...newUserForm, fullName: e.target.value })
                }
              />
            </div>
            {!editingUser && (
              <>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="user@bicol-u.edu.ph"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="Enter secure password"
                  />
                </div>
              </>
            )}
            {editingUser && (
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={editingUser.email} disabled className="bg-muted" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Role {editingUser ? '' : '*'}</Label>
              <Select
                value={editingUser ? formData.role : newUserForm.role}
                onValueChange={(value: 'student' | 'faculty' | 'admin') => editingUser 
                  ? setFormData({ ...formData, role: value })
                  : setNewUserForm({ ...newUserForm, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department (optional)</Label>
              <Select
                value={editingUser ? formData.departmentId : newUserForm.departmentId}
                onValueChange={(value) => editingUser 
                  ? setFormData({ ...formData, departmentId: value })
                  : setNewUserForm({ ...newUserForm, departmentId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(editingUser ? formData.role === 'student' : newUserForm.role === 'student') && (
              <div className="space-y-2">
                <Label>Batch Year (optional)</Label>
                <Input
                  type="number"
                  value={editingUser ? formData.batchYear : newUserForm.batchYear}
                  onChange={(e) => editingUser 
                    ? setFormData({ ...formData, batchYear: e.target.value })
                    : setNewUserForm({ ...newUserForm, batchYear: e.target.value })
                  }
                  placeholder="e.g. 2024"
                />
              </div>
            )}
            {editingUser && (
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
            <Button type="button" variant="outline" onClick={() => {
              setEditingUser(null);
              setIsAddingNew(false);
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={editingUser ? handleSaveUser : handleCreateUser} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingUser ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                editingUser ? 'Save Changes' : 'Create User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
