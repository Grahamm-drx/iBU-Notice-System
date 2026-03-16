import { useState, useEffect } from 'react';
import {
  Save,
  Settings as SettingsIcon,
  Bell,
  FileText,
  Mail,
  Loader2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemSetting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({
    site_title: 'Bicol University Student Notice System',
    default_notice_expiry_days: '30',
    max_file_upload_mb: '10',
    email_notifications: 'true',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) throw error;

      if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach((setting: SystemSetting) => {
          settingsMap[setting.key] = setting.value || '';
        });
        setSettings({ ...settings, ...settingsMap });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from('system_settings')
          .upsert({ key, value }, { onConflict: 'key' });
      }
      toast({
        title: 'Settings saved',
        description: 'Your changes have been saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure system preferences and defaults</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-card/60 border border-border/50">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notices" className="gap-2">
            <FileText className="w-4 h-4" />
            Notices
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site_title">Site Title</Label>
                <Input
                  id="site_title"
                  value={settings.site_title}
                  onChange={(e) => updateSetting('site_title', e.target.value)}
                  placeholder="Enter site title"
                />
                <p className="text-xs text-muted-foreground">
                  This title is displayed in the browser tab and header
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="max_file_upload">Maximum File Upload Size (MB)</Label>
                <Input
                  id="max_file_upload"
                  type="number"
                  value={settings.max_file_upload_mb}
                  onChange={(e) => updateSetting('max_file_upload_mb', e.target.value)}
                  min={1}
                  max={50}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum size for notice attachments (1-50 MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notices">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Notice Settings</CardTitle>
              <CardDescription>Configure default notice behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="expiry_days">Default Notice Expiry (Days)</Label>
                <Input
                  id="expiry_days"
                  type="number"
                  value={settings.default_notice_expiry_days}
                  onChange={(e) => updateSetting('default_notice_expiry_days', e.target.value)}
                  min={1}
                  max={365}
                />
                <p className="text-xs text-muted-foreground">
                  Number of days before a notice automatically expires
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notice Templates</h4>
                <p className="text-sm text-muted-foreground">
                  Pre-built templates for common notice types
                </p>
                
                <div className="grid gap-3">
                  {[
                    { name: 'Exam Schedule', category: 'exam' },
                    { name: 'Event Announcement', category: 'events' },
                    { name: 'Class Update', category: 'class' },
                    { name: 'General Announcement', category: 'general' },
                  ].map((template) => (
                    <div
                      key={template.name}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-secondary/30"
                    >
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          Category: {template.category}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit Template
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email and push notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for new notices
                  </p>
                </div>
                <Switch
                  checked={settings.email_notifications === 'true'}
                  onCheckedChange={(checked) =>
                    updateSetting('email_notifications', checked.toString())
                  }
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Events</h4>
                
                <div className="space-y-3">
                  {[
                    { label: 'New urgent notices', enabled: true },
                    { label: 'Notice expiring soon', enabled: true },
                    { label: 'New user registration', enabled: false },
                    { label: 'Daily digest', enabled: false },
                  ].map((event) => (
                    <div
                      key={event.label}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{event.label}</span>
                      </div>
                      <Switch defaultChecked={event.enabled} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
