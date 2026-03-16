-- Seed test users from ibu-notice-system.sql sample
-- Password: 'password123' for all (bcrypt $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'admin@bicol-u.edu.ph', '$2y$10$eUeu1/K5kWhAqKQM4hpXm.525ykd7wkfvuLIb/CqYIxXDjcYYpFty', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'fac@bicol-u.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'student@bicol-u.edu.ph', '$2y$10$Ic40WX2ckQgIDaluE7kKTe6EPQ9yNV5I0f396kfXq1rEvKuUq9j.W', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Profiles
INSERT INTO public.profiles (id, user_id, email, full_name, student_id, department_id, year_level, status) VALUES
  ('00000000-0000-0000-0000-000000000101'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'admin@bicol-u.edu.ph', 'Administrator', null, null, null, 'A'),
  ('00000000-0000-0000-0000-000000000102'::uuid, '00000000-0000-0000-0000-000000000002'::uuid, 'fac@bicol-u.edu.ph', 'Dr. Maria Santos', null, '00000000-0000-0000-0000-000000000001'::uuid, null, 'A'),
  ('00000000-0000-0000-0000-000000000103'::uuid, '00000000-0000-0000-0000-000000000003'::uuid, 'student@bicol-u.edu.ph', 'John Drex F. Cantor', '2024-01-07787', '00000000-0000-0000-0000-000000000001'::uuid, 3, 'A')
ON CONFLICT (id) DO NOTHING;

-- Roles
INSERT INTO public.user_roles (user_id, role) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'admin'),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'faculty'),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'student')
ON CONFLICT (user_id, role) DO NOTHING;

-- Enrollments (student)
INSERT INTO public.student_enrollments (student_id, block_id, semester, school_year) VALUES
  ('00000000-0000-0000-0000-000000000103'::uuid, '00000000-0000-0000-0000-000000000003'::uuid, '1st', '2025-2026')
ON CONFLICT DO NOTHING;

-- Test creds:
-- admin@bicol-u.edu.ph / password123
-- fac@bicol-u.edu.ph / password123  
-- student@bicol-u.edu.ph / password123

