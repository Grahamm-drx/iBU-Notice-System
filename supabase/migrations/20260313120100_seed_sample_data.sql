-- Seed sample data matching ibu-notice-system.sql

-- Departments (if not exist)
INSERT INTO public.departments (id, code, name, status, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'CSD', 'Computer Science Department', 'A', NOW()),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'EDUC', 'Education Department', 'A', NOW()),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'NURSING', 'Nursing Department', 'A', NOW())
ON CONFLICT (id) DO NOTHING;

-- Programs
INSERT INTO public.programs (id, code, name, department_id, status, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'BSCS', 'Bachelor of Science in Computer Science', '00000000-0000-0000-0000-000000000001'::uuid, 'A', NOW()),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'BSIT', 'Bachelor of Science in Information Technology', '00000000-0000-0000-0000-000000000001'::uuid, 'A', NOW()),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'BSED', 'Bachelor of Secondary Education', '00000000-0000-0000-0000-000000000002'::uuid, 'A', NOW()),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'BSN', 'Bachelor of Science in Nursing', '00000000-0000-0000-0000-000000000003'::uuid, 'A', NOW())
ON CONFLICT (id) DO NOTHING;

-- Blocks
INSERT INTO public.blocks (id, block_code, program_id, year_level, section, status, created_at) VALUES
  ('00000000-0000-0000-0000-000000000003'::uuid, 'BSCS-3A', '00000000-0000-0000-0000-000000000001'::uuid, 3, 'A', 'A', NOW()),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'BSCS-1A', '00000000-0000-0000-0000-000000000001'::uuid, 1, 'A', 'A', NOW()),
  ('00000000-0000-0000-0000-000000000006'::uuid, 'BSN-2A', '00000000-0000-0000-0000-000000000004'::uuid, 2, 'A', 'A', NOW())
ON CONFLICT (id) DO NOTHING;

-- Subjects
INSERT INTO public.subjects (id, subject_code, subject_name, units, program_id, year_level, semester, status, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'CS301', 'Web Development', 3, '00000000-0000-0000-0000-000000000001'::uuid, 3, '1st', 'A', NOW()),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'CS302', 'Database Systems', 3, '00000000-0000-0000-0000-000000000001'::uuid, 3, '2nd', 'A', NOW())
ON CONFLICT (id) DO NOTHING;

-- Sample Notices
INSERT INTO public.notices (id, title, content, category, priority, author_id, created_at, target_departments, target_blocks) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'BSCS-3A Class Suspension', 'Classes for BSCS-3A suspended tomorrow.', 'class', 'high', '00000000-0000-0000-0000-000000000001'::uuid, NOW(), NULL, ARRAY['00000000-0000-0000-0000-000000000003'::uuid]),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Midterm Exam Schedule', 'Midterms start next week. Check dept boards.', 'exam', 'normal', '00000000-0000-0000-0000-000000000001'::uuid, NOW(), ARRAY['00000000-0000-0000-0000-000000000001'::uuid], NULL)
ON CONFLICT (id) DO NOTHING;

-- Note: Create test profiles/users via Supabase dashboard or auth signup for enrollments

