import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Calendar as CalendarIcon,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import apiClient from '@/integrations/api/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Department {
  id: number;
  code: string;
  name: string;
}

interface Program {
  id: number;
  code: string;
  name: string;
  department_id: number;
}

const BLOCKS = ['A', 'B', 'C', 'D', 'E'];

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['exam', 'events', 'class', 'general']),
  priority: z.enum(['low', 'normal', 'high', 'critical']),
  target_departments: z.array(z.string()).optional(),
  target_programs: z.array(z.string()).optional(),
  target_year_levels: z.array(z.number()).optional(),
  target_blocks: z.array(z.string()).optional(),
  target_all: z.boolean().default(true),
  expire_date: z.date().optional().nullable(),
  is_pinned: z.boolean().default(false),
  status: z.enum(['draft', 'published']),
});

type FormValues = z.infer<typeof formSchema>;

type FormValues = z.infer<typeof formSchema>;

const CreateEditNotice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);

  const isEditing = !!id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'general',
      priority: 'normal',
      target_departments: [],
      target_programs: [],
      target_year_levels: [],
      target_blocks: [],
      target_all: true,
      expire_date: null,
      is_pinned: false,
      status: 'draft',
    },
  });

  useEffect(() => {
    fetchDepartments();
    if (id) {
      fetchNotice(id);
    }
  }, [id]);

  const fetchDepartments = async () => {
    try {
      const [deptRes, progRes] = await Promise.all([
        apiClient.departments.list(),
        apiClient.programs.list(),
      ]);
      setDepartments(deptRes || []);
      setPrograms(progRes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchNotice = async (noticeId: string) => {
    setLoading(true);
    try {
      const data = await apiClient.notices.get(parseInt(noticeId));

      if (data) {
        form.reset({
          title: data.title,
          content: data.content,
          category: data.category || 'general',
          priority: data.priority,
          target_departments: data.target_departments || [],
          target_programs: data.target_programs || [],
          target_year_levels: data.target_year_levels || [],
          target_blocks: data.target_blocks || [],
          target_all: data.target_all,
          expire_date: data.expire_date ? new Date(data.expire_date) : null,
          is_pinned: data.is_pinned,
          status: data.is_published ? 'published' : 'draft',
        });
      }
    } catch (error) {
      console.error('Error fetching notice:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notice',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

const onSubmit = async (values: FormValues) => {
  if (!user) return;

  setSaving(true);
  try {
    const targetDepts = values.target_all ? null : values.target_departments;
    const noticeData = {
      title: values.title,
      content: values.content,
      category: values.category,
      priority: values.priority,
      target_departments: targetDepts,
      target_programs: values.target_all ? null : values.target_programs,
      target_year_levels: values.target_all ? null : values.target_year_levels,
      target_blocks: values.target_all ? null : values.target_blocks,
      target_all: values.target_all,
      expire_date: values.expire_date?.toISOString() || null,
      is_pinned: values.is_pinned,
      is_published: values.status === 'published',
      status: values.status,
      author_id: user.id,
      publish_date: values.status === 'published' ? new Date().toISOString() : null,
    };

    if (isEditing && id) {
      await apiClient.notices.update(parseInt(id), noticeData);
      toast({ title: 'Notice updated successfully' });
    } else {
      await apiClient.notices.create(noticeData);
      toast({ title: 'Notice created successfully' });
    }

    navigate('/admin/notices');
  } catch (error) {
    console.error('Error saving notice:', error);
    toast({
      title: 'Error',
      description: 'Failed to save notice',
      variant: 'destructive',
    });
  } finally {
    setSaving(false);
  }
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload PDF, DOC, JPG, or PNG files only',
          variant: 'destructive',
        });
        return;
      }
      setAttachment(file);
    }
  };

  const watchedValues = form.watch();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/notices')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? 'Edit Notice' : 'Create New Notice'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? 'Update the notice details below'
              : 'Fill in the details to create a new notice'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Notice Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter notice title"
                            maxLength={255}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value.length}/255 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter notice content..."
                            className="min-h-[200px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Attachment */}
                  <div className="space-y-2">
                    <Label>Attachment (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                      {attachment ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm">{attachment.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setAttachment(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, DOC, JPG, PNG (Max 10MB)
                          </p>
                        </label>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Target Departments */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Target Audience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="target_all"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          Send to all departments
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  {!watchedValues.target_all && (
                    <div className="space-y-4">
                      {/* Departments */}
                      <FormField
                        control={form.control}
                        name="target_departments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Departments (Colleges)</FormLabel>
                            <div className="flex flex-wrap gap-2">
                              {departments.map((dept) => (
                                <Badge
                                  key={dept.id}
                                  variant={field.value?.includes(String(dept.id)) ? 'default' : 'outline'}
                                  className="cursor-pointer transition-colors"
                                  onClick={() => {
                                    const current = field.value || [];
                                    if (current.includes(String(dept.id))) {
                                      field.onChange(current.filter((id) => id !== String(dept.id)));
                                    } else {
                                      field.onChange([...current, String(dept.id)]);
                                    }
                                  }}
                                >
                                  {dept.code}
                                </Badge>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Programs */}
                      <FormField
                        control={form.control}
                        name="target_programs"
                        render={({ field }) => {
                          const selectedDepts = watchedValues.target_departments || [];
                          const filteredProgs = selectedDepts.length > 0
                            ? programs.filter((p) => selectedDepts.includes(String(p.department_id)))
                            : programs;
                          return (
                            <FormItem>
                              <FormLabel>Select Programs / Courses</FormLabel>
                              <div className="flex flex-wrap gap-2">
                                {filteredProgs.map((prog) => (
                                  <Badge
                                    key={prog.id}
                                    variant={field.value?.includes(String(prog.id)) ? 'default' : 'outline'}
                                    className="cursor-pointer transition-colors"
                                    onClick={() => {
                                      const current = field.value || [];
                                      if (current.includes(String(prog.id))) {
                                        field.onChange(current.filter((id) => id !== String(prog.id)));
                                      } else {
                                        field.onChange([...current, String(prog.id)]);
                                      }
                                    }}
                                  >
                                    {prog.code}
                                  </Badge>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      {/* Year Levels */}
                      <FormField
                        control={form.control}
                        name="target_year_levels"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Year Levels</FormLabel>
                            <div className="flex flex-wrap gap-2">
                              {[1, 2, 3, 4].map((year) => (
                                <Badge
                                  key={year}
                                  variant={field.value?.includes(year) ? 'default' : 'outline'}
                                  className="cursor-pointer transition-colors"
                                  onClick={() => {
                                    const current = field.value || [];
                                    if (current.includes(year)) {
                                      field.onChange(current.filter((y) => y !== year));
                                    } else {
                                      field.onChange([...current, year]);
                                    }
                                  }}
                                >
                                  Year {year}
                                </Badge>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Blocks */}
                      <FormField
                        control={form.control}
                        name="target_blocks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Blocks / Sections</FormLabel>
                            <div className="flex flex-wrap gap-2">
                              {BLOCKS.map((block) => (
                                <Badge
                                  key={block}
                                  variant={field.value?.includes(block) ? 'default' : 'outline'}
                                  className="cursor-pointer transition-colors"
                                  onClick={() => {
                                    const current = field.value || [];
                                    if (current.includes(block)) {
                                      field.onChange(current.filter((b) => b !== block));
                                    } else {
                                      field.onChange([...current, block]);
                                    }
                                  }}
                                >
                                  Block {block}
                                </Badge>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category & Priority */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Classification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-2 gap-2"
                          >
                            {['exam', 'events', 'class', 'general'].map((cat) => (
                              <div key={cat} className="flex items-center space-x-2">
                                <RadioGroupItem value={cat} id={cat} />
                                <Label htmlFor={cat} className="capitalize cursor-pointer">
                                  {cat}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">
                              <span className="text-destructive font-medium">
                                Urgent / Critical
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Publishing Options */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="draft" id="draft" />
                              <Label htmlFor="draft" className="cursor-pointer">
                                Save as Draft
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="published" id="published" />
                              <Label htmlFor="published" className="cursor-pointer">
                                Publish Immediately
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expire_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiry Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_pinned"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Pin to top of lists</FormLabel>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {watchedValues.status === 'published'
                        ? 'Publish Notice'
                        : 'Save as Draft'}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Notice Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
            <h2 className="text-xl font-bold">{watchedValues.title || 'Untitled'}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="capitalize">
                {watchedValues.category}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  watchedValues.priority === 'critical' && 'bg-destructive text-destructive-foreground'
                )}
              >
                {watchedValues.priority}
              </Badge>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">
                {watchedValues.content || 'No content'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateEditNotice;

