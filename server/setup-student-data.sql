-- Enhanced Seed: BEEd-2A Student Enrollment for iBU Notice System
-- MySQL ibu-notice-system DB (phpMyAdmin: localhost/phpmyadmin → ibu-notice-system)
-- Run this AFTER ensuring XAMPP MySQL running.

USE `ibu-notice-system`;

-- 1. Add Department: EDUC (Elementary Education)
INSERT IGNORE INTO departments (DeptID, DeptCode, DeptName, Status, CreatedAt) VALUES
(2, 'EDUC', 'College of Education', 'A', NOW());

-- 2. Add Program: BEEd
INSERT IGNORE INTO programs (ProgramID, ProgramCode, ProgramName, DeptID, Status, CreatedAt) VALUES
('00000000-0000-0000-0000-000000000002', 'BEEd', 'Bachelor of Elementary Education', 2, 'A', NOW());

-- 3. Add Block: BEEd-2A (Year 2, Section A)
INSERT IGNORE INTO blocks (BlockID, BlockName, BlockCode, ProgramID, YearLevel, Section, department_code, Status, CreatedAt) VALUES
(4, 'BEEd-2A', 'BEEd-2A', '00000000-0000-0000-0000-000000000002', 2, 'A', 'EDUC', 'A', NOW());

-- 4. Ensure test student exists (from seeds: John Drex F. Cantor / student@bicol-u.edu.ph)
-- If not, register via app or INSERT (password: password123 hashed below)
INSERT IGNORE INTO users (UserID, FullName, Email, Password, Role, Status, DeptID, BatchYear, CreatedAt) VALUES
('2024-01-07787', 'John Drex F. Cantor', 'student@bicol-u.edu.ph', '$2y$10$Ic40WX2ckQgIDaluE7kKTe6EPQ9yNV5I0f396kfXq1rEvKuUq9j.W', 'Student', 'A', 2, 2026, NOW());

-- 5. Link student to BEEd-2A block
DELETE FROM student_enrollment WHERE StudentID = '2024-01-07787';
INSERT INTO student_enrollment (StudentID, BlockID, Semester, SchoolYear, Status, EnrolledAt) VALUES
('2024-01-07787', 4, '1st', '2025-2026', 'E', NOW());

-- VERIFY: Should show BEEd-2A (2nd year) • EDUC
SELECT 
  u.FullName AS Student,
  u.UserID AS StudentID,
  b.BlockCode AS Block,
  b.YearLevel,
  d.DeptCode AS DeptCode,
  p.ProgramName
FROM student_enrollment se
JOIN users u ON se.StudentID = u.UserID
JOIN blocks b ON se.BlockID = b.BlockID
JOIN programs p ON b.ProgramID = p.ProgramID
JOIN departments d ON p.DeptID = d.DeptID
WHERE u.UserID = '2024-01-07787';

-- Notes:
-- - Run in phpMyAdmin SQL tab.
-- - Login test: student@bicol-u.edu.ph / password123 → Dashboard should show 'BEEd-2A (2nd year) • EDUC'.
-- - BlockID=4, ProgramID/DeptID explicit to avoid FK issues.
-- - If tables missing: Create from ibu-notice-system.sql dump first.

