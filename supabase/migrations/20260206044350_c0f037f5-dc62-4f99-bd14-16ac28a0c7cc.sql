-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'faculty', 'admin');

-- Create enum for notice types
CREATE TYPE public.notice_type AS ENUM ('general', 'urgent', 'academic', 'event');

-- Create enum for notice priority
CREATE TYPE public.notice_priority AS ENUM ('low', 'normal', 'high', 'critical');

-- Create departments table
CREATE TABLE public.departments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default departments
INSERT INTO public.departments (name, code) VALUES
    ('College of Arts and Letters', 'CAL'),
    ('College of Business, Economics and Management', 'CBEM'),
    ('College of Education', 'COEd'),
    ('College of Engineering', 'COE'),
    ('College of Industrial Technology', 'CIT'),
    ('College of Nursing', 'CON'),
    ('College of Science', 'CS'),
    ('College of Social Sciences and Philosophy', 'CSSP'),
    ('Institute of Physical Education, Sports and Recreation', 'IPESR'),
    ('Graduate School', 'GS');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    student_id TEXT,
    department_id UUID REFERENCES public.departments(id),
    year_level INTEGER CHECK (year_level >= 1 AND year_level <= 5),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create notices table
CREATE TABLE public.notices (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    notice_type notice_type NOT NULL DEFAULT 'general',
    priority notice_priority NOT NULL DEFAULT 'normal',
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_all BOOLEAN NOT NULL DEFAULT true,
    target_departments UUID[] DEFAULT '{}',
    target_year_levels INTEGER[] DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT false,
    publish_date TIMESTAMP WITH TIME ZONE,
    expire_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notice_reads table to track which notices users have read
CREATE TABLE public.notice_reads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    notice_id UUID NOT NULL REFERENCES public.notices(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (notice_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notice_reads ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Create function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role
    FROM public.user_roles
    WHERE user_id = _user_id
    LIMIT 1
$$;

-- Create function to get user's profile
CREATE OR REPLACE FUNCTION public.get_user_profile(_user_id UUID)
RETURNS TABLE(department_id UUID, year_level INTEGER)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT department_id, year_level
    FROM public.profiles
    WHERE user_id = _user_id
    LIMIT 1
$$;

-- RLS Policies for departments (publicly readable)
CREATE POLICY "Departments are publicly readable"
ON public.departments FOR SELECT
USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Faculty can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'faculty'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for notices
CREATE POLICY "Published notices are readable by authenticated users"
ON public.notices FOR SELECT
TO authenticated
USING (
    is_published = true
    AND (publish_date IS NULL OR publish_date <= now())
    AND (expire_date IS NULL OR expire_date > now())
    AND (
        target_all = true
        OR (
            EXISTS (
                SELECT 1 FROM public.get_user_profile(auth.uid()) up
                WHERE 
                    (array_length(target_departments, 1) IS NULL OR up.department_id = ANY(target_departments))
                    AND (array_length(target_year_levels, 1) IS NULL OR up.year_level = ANY(target_year_levels))
            )
        )
    )
);

CREATE POLICY "Authors can view their own notices"
ON public.notices FOR SELECT
TO authenticated
USING (author_id = auth.uid());

CREATE POLICY "Faculty can create notices"
ON public.notices FOR INSERT
TO authenticated
WITH CHECK (
    public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Authors can update their notices"
ON public.notices FOR UPDATE
TO authenticated
USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their notices"
ON public.notices FOR DELETE
TO authenticated
USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all notices"
ON public.notices FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for notice_reads
CREATE POLICY "Users can view their own reads"
ON public.notice_reads FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can mark notices as read"
ON public.notice_reads FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notices_updated_at
BEFORE UPDATE ON public.notices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to auto-create profile and role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email)
    VALUES (NEW.id, NEW.email);
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'student');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();