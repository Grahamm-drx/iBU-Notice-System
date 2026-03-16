-- Seed student_enrollment data from ibu-notice-system.sql dump
-- For test student 2024-01-07787 → BSCS-3A (BlockID=3)

USE `ibu-notice-system`;

-- Clear existing (if any)
DELETE FROM `student_enrollment` WHERE StudentID IN ('2024-01-07787', '2024-01-91406');

-- Add test students from your dump
INSERT INTO `student_enrollment` (`StudentID`, `BlockID`, `Semester`, `SchoolYear`, `Status`, `EnrolledAt`) VALUES
('2024-01-07787', 3, '1st', '2025-2026', 'E', NOW()),  -- BSCS-3A
('2024-01-91406', 1, '1st', '2025-2026', 'E', NOW()),  -- BSCS-1A
('2024-01-07788', 3, '1st', '2025-2026', 'E', NOW());  -- BSCS-3A

-- Verify
SELECT 
  u.FullName,
  se.StudentID,
  b.BlockCode,
  p.ProgramName,
  se.Semester,
  se.SchoolYear
FROM student_enrollment se
JOIN users u ON se.StudentID = u.UserID
JOIN blocks b ON se.BlockID = b.BlockID
JOIN programs p ON b.ProgramID = p.ProgramID;

