
-- Create programs table (courses like BSIT, BSIS, BSCS under colleges)
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Programs are publicly readable
CREATE POLICY "Programs are publicly readable"
ON public.programs FOR SELECT
USING (true);

-- Admins can manage programs
CREATE POLICY "Admins can manage programs"
ON public.programs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add program_id and block to profiles
ALTER TABLE public.profiles ADD COLUMN program_id UUID REFERENCES public.programs(id);
ALTER TABLE public.profiles ADD COLUMN block VARCHAR;

-- Add target_programs and target_blocks to notices
ALTER TABLE public.notices ADD COLUMN target_programs UUID[] DEFAULT '{}'::uuid[];
ALTER TABLE public.notices ADD COLUMN target_blocks TEXT[] DEFAULT '{}'::text[];

-- Insert programs for CIT (College of Industrial Technology)
INSERT INTO public.programs (name, code, department_id) VALUES
  ('BS Information Technology', 'BSIT', 'f6533e8a-9ebc-4d3d-b40d-d81024d3c921'),
  ('BS Information Systems', 'BSIS', 'f6533e8a-9ebc-4d3d-b40d-d81024d3c921'),
  ('BS Computer Science', 'BSCS', '0b3b9779-89dd-4bad-8717-d10e0f93c77c'),
  ('BS Electronics Technology', 'BSET', 'f6533e8a-9ebc-4d3d-b40d-d81024d3c921'),
  ('BS Civil Engineering', 'BSCE', '8692df47-ea72-45fe-bbcd-fdbe6f481adf'),
  ('BS Electrical Engineering', 'BSEE', '8692df47-ea72-45fe-bbcd-fdbe6f481adf'),
  ('BS Mechanical Engineering', 'BSME', '8692df47-ea72-45fe-bbcd-fdbe6f481adf'),
  ('BS Nursing', 'BSN', 'd61b63cc-72ee-4c4c-a382-1f9542566760'),
  ('BS Education', 'BSEd', '7f93b197-b0c1-4066-9aa8-2ae7d3a2c00e'),
  ('BS Business Administration', 'BSBA', '04b12076-9ab5-490c-b868-2d0350b93de9');

-- Update RLS for notices to also check programs and blocks
DROP POLICY IF EXISTS "Published notices are readable by authenticated users" ON public.notices;

CREATE POLICY "Published notices are readable by authenticated users"
ON public.notices FOR SELECT
USING (
  (is_published = true)
  AND ((publish_date IS NULL) OR (publish_date <= now()))
  AND ((expire_date IS NULL) OR (expire_date > now()))
  AND (
    (target_all = true)
    OR EXISTS (
      SELECT 1
      FROM profiles p
      WHERE p.user_id = auth.uid()
        AND (
          (array_length(notices.target_departments, 1) IS NULL) OR (p.department_id = ANY(notices.target_departments))
        )
        AND (
          (array_length(notices.target_year_levels, 1) IS NULL) OR (p.year_level = ANY(notices.target_year_levels))
        )
        AND (
          (array_length(notices.target_programs, 1) IS NULL) OR (p.program_id = ANY(notices.target_programs))
        )
        AND (
          (array_length(notices.target_blocks, 1) IS NULL) OR (p.block = ANY(notices.target_blocks))
        )
    )
  )
);
