-- Add notice_category enum to align with PDF requirements
CREATE TYPE public.notice_category AS ENUM ('exam', 'events', 'class', 'general');

-- Add activity_logs table for audit trail
CREATE TABLE public.activity_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    activity VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all activity logs
CREATE POLICY "Admins can view all activity logs"
ON public.activity_logs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: System can insert activity logs
CREATE POLICY "Authenticated users can insert activity logs"
ON public.activity_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add new columns to notices table
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS category notice_category DEFAULT 'general';
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'draft';

-- Add status column to departments
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active';

-- Add new columns to profiles for user management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS batch_year INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notices_category ON public.notices(category);
CREATE INDEX IF NOT EXISTS idx_notices_is_pinned ON public.notices(is_pinned);
CREATE INDEX IF NOT EXISTS idx_notices_status ON public.notices(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at);

-- Create notice templates table
CREATE TABLE public.notice_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category notice_category DEFAULT 'general',
    priority notice_priority DEFAULT 'normal',
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notice_templates
ALTER TABLE public.notice_templates ENABLE ROW LEVEL SECURITY;

-- Admins and faculty can manage templates
CREATE POLICY "Admins and faculty can view templates"
ON public.notice_templates
FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Admins and faculty can create templates"
ON public.notice_templates
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Admins and faculty can update templates"
ON public.notice_templates
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Admins can delete templates"
ON public.notice_templates
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create system_settings table
CREATE TABLE public.system_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_by UUID
);

-- Enable RLS on system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage settings
CREATE POLICY "Admins can view settings"
ON public.system_settings
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
ON public.system_settings
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default settings
INSERT INTO public.system_settings (key, value, description) VALUES
('site_title', 'Bicol University Student Notice System', 'The title displayed on the system'),
('default_notice_expiry_days', '30', 'Default number of days before a notice expires'),
('max_file_upload_mb', '10', 'Maximum file upload size in MB'),
('email_notifications', 'true', 'Enable email notifications')
ON CONFLICT (key) DO NOTHING;

-- Create storage bucket for attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('notice-attachments', 'notice-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for notice attachments
CREATE POLICY "Anyone can view notice attachments"
ON storage.objects
FOR SELECT
USING (bucket_id = 'notice-attachments');

CREATE POLICY "Admins and faculty can upload notice attachments"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'notice-attachments' 
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'))
);

CREATE POLICY "Admins and faculty can update notice attachments"
ON storage.objects
FOR UPDATE
USING (
    bucket_id = 'notice-attachments' 
    AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'))
);

CREATE POLICY "Admins can delete notice attachments"
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'notice-attachments' 
    AND public.has_role(auth.uid(), 'admin')
);