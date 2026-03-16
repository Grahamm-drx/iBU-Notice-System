import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Mail,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StudentLayout from '@/components/student/StudentLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Department {
  id: string;
  name: string;
  code: string;
}

const StudentProfilePage = () => {
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRead: 0,
    totalNotices: 0,
    readPercentage: 0,
  });
  const [formData, setFormData] = useState({
    full_name: '',
    student_id: '',
    department_id: '',
    year_level: '',
    batch_year: '',
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    urgentAlerts: true,
    departmentOnly: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch departments
      const { data: deptsData } = await supabase.from('departments').select('*');
      if (deptsData) setDepartments(deptsData);

      // Fetch read stats
      if (user) {
        const { count: readCount } = await supabase
          .from('notice_reads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: totalCount } = await supabase
          .from('notices')
          .select('*', { count: 'exact', head: true })
          .eq('is_published', true);

        const read = readCount || 0;
        const total = totalCount || 0;
        const pct = total > 0 ? Math.round((read / total) * 100) : 0;

        setStats({
          totalRead: read,
          totalNotices: total,
          readPercentage: pct,
        });
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        student_id: profile.student_id || '',
        department_id: profile.department_id || '',
        year_level: profile.year_level?.toString() || '',
        batch_year: profile.batch_year?.toString() || '',
      });
    }
  }, [profile]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/student/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          student_id: formData.student_id || null,
          department_id: formData.department_id || null,
          year_level: formData.year_level ? parseInt(formData.year_level) : null,
          batch_year: formData.batch_year ? parseInt(formData.batch_year) : null,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
      refreshProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const department = departments.find((d) => d.id === profile?.department_id);

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
        {/* Header */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-student/20 via-accent/10 to-student/20 rounded-2xl blur-xl opacity-50" />
          <div className="relative bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-student/10 flex items-center justify-center">
                  <GraduationCap className="w-12 h-12 text-student" />
                </div>
                <Badge className="absolute -bottom-2 -right-2 bg-student">
                  Student
                </Badge>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {profile?.full_name || 'Student'}
                </h1>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {profile?.email}
                  </div>
                  {department && (
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" />
                      {department.code} - {department.name}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Joined {format(new Date(profile?.created_at || new Date()), 'MMM yyyy')}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-student">{stats.totalRead}</p>
                  <p className="text-xs text-muted-foreground">Notices Read</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.readPercentage}%</p>
                  <p className="text-xs text-muted-foreground">Read Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-card/60 backdrop-blur-sm border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={profile?.email || ''} disabled />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({ ...formData, full_name: e.target.value })
                        }
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student_id">Student ID</Label>
                      <Input
                        id="student_id"
                        value={formData.student_id}
                        onChange={(e) =>
                          setFormData({ ...formData, student_id: e.target.value })
                        }
                        placeholder="e.g., 2024-12345"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select
                        value={formData.department_id}
                        onValueChange={(value) =>
                          setFormData({ ...formData, department_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.code} - {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Year Level</Label>
                      <Select
                        value={formData.year_level}
                        onValueChange={(value) =>
                          setFormData({ ...formData, year_level: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                          <SelectItem value="5">5th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batch_year">Batch Year</Label>
                      <Input
                        id="batch_year"
                        type="number"
                        value={formData.batch_year}
                        onChange={(e) =>
                          setFormData({ ...formData, batch_year: e.target.value })
                        }
                        placeholder="e.g., 2024"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats">
            <Card className="bg-card/60 backdrop-blur-sm border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Reading Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/50 text-center">
                    <Bell className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-2xl font-bold">{stats.totalNotices}</p>
                    <p className="text-sm text-muted-foreground">Total Notices</p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/10 text-center">
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold text-green-600">{stats.totalRead}</p>
                    <p className="text-sm text-muted-foreground">Notices Read</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/10 text-center">
                    <Bell className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <p className="text-2xl font-bold text-accent">
                      {stats.totalNotices - stats.totalRead}
                    </p>
                    <p className="text-sm text-muted-foreground">Unread</p>
                  </div>
                  <div className="p-4 rounded-xl bg-student/10 text-center">
                    <BarChart3 className="w-6 h-6 mx-auto mb-2 text-student" />
                    <p className="text-2xl font-bold text-student">{stats.readPercentage}%</p>
                    <p className="text-sm text-muted-foreground">Read Rate</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground">Account Created</span>
                      <span>{format(new Date(profile?.created_at || new Date()), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span>{format(new Date(profile?.updated_at || new Date()), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Account Status</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Notification Preferences */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates for new notices
                      </p>
                    </div>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, emailNotifications: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Urgent Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified for urgent notices
                      </p>
                    </div>
                    <Switch
                      checked={preferences.urgentAlerts}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, urgentAlerts: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Department Notices Only</p>
                      <p className="text-sm text-muted-foreground">
                        Only receive notices for your department
                      </p>
                    </div>
                    <Switch
                      checked={preferences.departmentOnly}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, departmentOnly: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Read Tracking Privacy</p>
                      <p className="text-sm text-muted-foreground">
                        Your reading activity is private
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                      Enabled
                    </Badge>
                  </div>
                  <Separator />
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default StudentProfilePage;
