-- Migration: Add Student/Faculty schema matching ibu-notice-system.sql

-- Enums
CREATE TYPE public.notice_category AS ENUM ('exam', 'events', 'class', 'general');
CREATE TYPE public.notice_priority AS ENUM ('low', 'normal', 'high', 'critical');
CREATE TYPE public.notice_type AS ENUM ('general', 'urgent', 'academic', 'event');
CREATE TYPE public.app_role AS ENUM ('student', 'faculty', 'admin');

-- Subjects
CREATE TABLE public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_code TEXT NOT NULL UNIQUE,
  subject_name TEXT NOT NULL,
  units INTEGER NOT NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  year_level INTEGER NOT NULL,
  semester TEXT NOT NULL, -- '1st', '2nd', 'Summer'
  status TEXT DEFAULT 'A' CHECK (status IN ('A', 'I')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blocks
CREATE TABLE public.blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block_code TEXT NOT NULL, -- 'BSCS-3A'
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  year_level INTEGER NOT NULL CHECK (year_level BETWEEN 1 AND 5),
  section TEXT NOT NULL, -- 'A', 'B'
  status TEXT DEFAULT 'A' CHECK (status IN ('A', 'I')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(program_id, year_level, section)
);

-- Student Enrollment
CREATE TABLE public.student_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  block_id UUID REFERENCES public.blocks(id) ON DELETE CASCADE,
  semester TEXT NOT NULL, -- '1st', '2nd', 'Summer'
  school_year TEXT NOT NULL, -- '2025-2026'
  status TEXT DEFAULT 'E' CHECK (status IN ('E', 'D', 'C')), -- Enrolled/Dropped/Completed
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, block_id, semester, school_year)
);

-- Faculty Handles (subjects/blocks they teach)
CREATE TABLE public.faculty_handles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  block_id UUID REFERENCES public.blocks(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  schedule TEXT,
  room TEXT,
  semester TEXT NOT NULL,
  school_year TEXT NOT NULL,
  is_active TEXT DEFAULT 'Y' CHECK (is_active IN ('Y', 'N')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(faculty_id, block_id, subject_id, semester, school_year)
);

-- User Roles (multi-role support)
CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- RPC Functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.app_role AS $$
BEGIN
  RETURN (SELECT role FROM public.user_roles WHERE user_id = $1 LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, required_role public.app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = $1 AND role = required_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update notices for better targeting (hybrid array + relational)
ALTER TABLE public.notices 
ADD COLUMN IF NOT EXISTS target_type TEXT DEFAULT 'All' CHECK (target_type IN ('All', 'Department', 'Block', 'Program', 'Subject'));

-- RLS Policies (example)
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY student_own_enrollment ON public.student_enrollments 
  FOR ALL USING (student_id = auth.uid());

ALTER TABLE public.faculty_handles ENABLE ROW LEVEL SECURITY;
CREATE POLICY faculty_own_handle ON public.faculty_handles 
  FOR ALL USING (faculty_id = auth.uid());

