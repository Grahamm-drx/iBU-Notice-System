import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FacultyLayout from '@/components/faculty/FacultyLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Program {
  id: string;
  name: string;
  code: string;
  department_id: string;
}

const BLOCKS = ['A', 'B', 'C', 'D', 'E'];

const CreateNoticePage = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [attachment, setAttachment] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    notice_type: 'general' as 'general' | 'urgent' | 'academic' | 'event',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'critical',
    category: 'general' as 'exam' | 'events' | 'class' | 'general',
    target_all: true,
    target_departments: [] as string[],
    target_year_levels: [] as number[],
    target_programs: [] as string[],
    target_blocks: [] as string[],
    is_published: false,
    is_pinned: false,
    expire_date: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const [deptRes, progRes] = await Promise.all([
        supabase.from('departments').select('*'),
        supabase.from('programs').select('*'),
      ]);
      if (deptRes.data) setDepartments(deptRes.data);
      if (progRes.data) setPrograms(progRes.data);
    };
    fetchData();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-faculty" />
      </div>
    );
  }

  if (!user || (role !== 'faculty' && role !== 'admin')) {
    return <Navigate to="/faculty/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let attachment_url: string | null = null;

      if (attachment) {
        const ext = attachment.name.split('.').pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('notice-attachments')
          .upload(path, attachment);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('notice-attachments')
          .getPublicUrl(path);
        attachment_url = urlData.publicUrl;
      }

      const { error } = await supabase.from('notices').insert({
        title: formData.title,
        content: formData.content,
        notice_type: formData.notice_type,
        priority: formData.priority,
        category: formData.category,
        target_all: formData.target_all,
        target_departments: formData.target_departments,
        target_year_levels: formData.target_year_levels,
        target_programs: formData.target_programs,
        target_blocks: formData.target_blocks,
        is_published: formData.is_published,
        is_pinned: formData.is_pinned,
        expire_date: formData.expire_date || null,
        attachment_url,
        author_id: user.id,
        publish_date: formData.is_published ? new Date().toISOString() : null,
      });

      if (error) throw error;

      toast.success(formData.is_published ? 'Notice published!' : 'Saved as draft');
      navigate('/faculty/notices');
    } catch (error) {
      console.error('Error creating notice:', error);
      toast.error('Failed to create notice');
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentToggle = (deptId: string) => {
    setFormData((prev) => ({
      ...prev,
      target_departments: prev.target_departments.includes(deptId)
        ? prev.target_departments.filter((id) => id !== deptId)
        : [...prev.target_departments, deptId],
    }));
  };

  const handleYearToggle = (year: number) => {
    setFormData((prev) => ({
      ...prev,
      target_year_levels: prev.target_year_levels.includes(year)
        ? prev.target_year_levels.filter((y) => y !== year)
        : [...prev.target_year_levels, year],
    }));
  };

  const handleProgramToggle = (progId: string) => {
    setFormData((prev) => ({
      ...prev,
      target_programs: prev.target_programs.includes(progId)
        ? prev.target_programs.filter((id) => id !== progId)
        : [...prev.target_programs, progId],
    }));
  };

  const handleBlockToggle = (block: string) => {
    setFormData((prev) => ({
      ...prev,
      target_blocks: prev.target_blocks.includes(block)
        ? prev.target_blocks.filter((b) => b !== block)
        : [...prev.target_blocks, block],
    }));
  };

  // Filter programs based on selected departments
  const filteredPrograms = formData.target_departments.length > 0
    ? programs.filter((p) => formData.target_departments.includes(p.department_id))
    : programs;

  return (
    <FacultyLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <Link to="/faculty/notices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Notice</h1>
            <p className="text-muted-foreground mt-1">Compose a new announcement</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Notice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  maxLength={255}
                  placeholder="Enter notice title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">{formData.title.length}/255</p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Enter notice content..."
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>

              {/* Category & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v: any) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v: any) => setFormData({ ...formData, priority: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notice Type */}
              <div className="space-y-2">
                <Label>Notice Type</Label>
                <Select
                  value={formData.notice_type}
                  onValueChange={(v: any) => setFormData({ ...formData, notice_type: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Attachment */}
              <div className="space-y-2">
                <Label>Attachment (optional)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  {attachment && (
                    <Badge variant="outline" className="text-xs">
                      <Upload className="w-3 h-3 mr-1" />
                      {attachment.name}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">PDF, DOC, JPG, PNG</p>
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <Label>Expiry Date (optional)</Label>
                <Input
                  type="datetime-local"
                  value={formData.expire_date}
                  onChange={(e) => setFormData({ ...formData, expire_date: e.target.value })}
                />
              </div>

              {/* Pin */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Pin Notice</Label>
                  <p className="text-sm text-muted-foreground">Pin to top of lists</p>
                </div>
                <Switch
                  checked={formData.is_pinned}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_pinned: checked })}
                />
              </div>

              {/* Target */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Target All Students</Label>
                    <p className="text-sm text-muted-foreground">Send to all students</p>
                  </div>
                  <Switch
                    checked={formData.target_all}
                    onCheckedChange={(checked) => setFormData({ ...formData, target_all: checked })}
                  />
                </div>

                {!formData.target_all && (
                  <>
                    <div className="space-y-2">
                      <Label>Target Departments</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {departments.map((dept) => (
                          <div key={dept.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={dept.id}
                              checked={formData.target_departments.includes(dept.id)}
                              onCheckedChange={() => handleDepartmentToggle(dept.id)}
                            />
                            <label htmlFor={dept.id} className="text-sm cursor-pointer">
                              {dept.code} - {dept.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Target Programs/Courses */}
                    <div className="space-y-2">
                      <Label>Target Programs / Courses</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {filteredPrograms.map((prog) => (
                          <div key={prog.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`prog-${prog.id}`}
                              checked={formData.target_programs.includes(prog.id)}
                              onCheckedChange={() => handleProgramToggle(prog.id)}
                            />
                            <label htmlFor={`prog-${prog.id}`} className="text-sm cursor-pointer">
                              {prog.code} - {prog.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Target Year Levels */}
                    <div className="space-y-2">
                      <Label>Target Year Levels</Label>
                      <div className="flex gap-4">
                        {[1, 2, 3, 4].map((year) => (
                          <div key={year} className="flex items-center space-x-2">
                            <Checkbox
                              id={`year-${year}`}
                              checked={formData.target_year_levels.includes(year)}
                              onCheckedChange={() => handleYearToggle(year)}
                            />
                            <label htmlFor={`year-${year}`} className="text-sm cursor-pointer">
                              Year {year}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Target Blocks/Sections */}
                    <div className="space-y-2">
                      <Label>Target Blocks / Sections</Label>
                      <div className="flex gap-4">
                        {BLOCKS.map((block) => (
                          <div key={block} className="flex items-center space-x-2">
                            <Checkbox
                              id={`block-${block}`}
                              checked={formData.target_blocks.includes(block)}
                              onCheckedChange={() => handleBlockToggle(block)}
                            />
                            <label htmlFor={`block-${block}`} className="text-sm cursor-pointer">
                              Block {block}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Publish */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="publish"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="publish">Publish immediately</Label>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-faculty hover:bg-faculty/90 text-faculty-foreground"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : formData.is_published ? (
                      'Publish Notice'
                    ) : (
                      'Save as Draft'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </FacultyLayout>
  );
};

export default CreateNoticePage;
