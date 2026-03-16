const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'ibu-notice-system-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await db.execute(
      'SELECT * FROM users WHERE Email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // For bcrypt hashes (Supabase format or new registrations)
    let validPassword = false;
    if (user.Password.startsWith('$2') || user.Password.startsWith('$P$')) {
      validPassword = await bcrypt.compare(password, user.Password);
    } else {
      // For plain text passwords in the current DB
      validPassword = password === user.Password;
    }
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    await db.execute(
      'UPDATE users SET LastLogin = NOW() WHERE UserID = ?',
      [user.UserID]
    );
    
    // Generate token
    const token = jwt.sign(
      { userId: user.UserID, email: user.Email, role: user.Role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Log activity
    await db.execute(
      'INSERT INTO activity_logs (UserID, Activity, Details, ActivityDate) VALUES (?, ?, ?, NOW())',
      [user.UserID, 'login', `User logged in from IP`]
    );
    
    res.json({
      token,
      user: {
        id: user.UserID,
        email: user.Email,
        fullName: user.FullName,
        role: user.Role.toLowerCase(),
        lastLogin: user.LastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;
    
    // Check if email exists
    const [existing] = await db.execute(
      'SELECT * FROM users WHERE Email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Generate user ID based on role
    let userId;
    if (role === 'student') {
      // Generate student ID (e.g., 2024-01-00001)
      const [result] = await db.execute(
        'SELECT COUNT(*) as count FROM users WHERE Role = "Student"'
      );
      userId = `2024-01-${String(result[0].count + 1).padStart(5, '0')}`;
    } else if (role === 'faculty') {
      const [result] = await db.execute(
        'SELECT COUNT(*) as count FROM users WHERE Role = "Faculty"'
      );
      userId = `FAC-${String(result[0].count + 1).padStart(5, '0')}`;
    } else {
      const [result] = await db.execute(
        'SELECT COUNT(*) as count FROM users WHERE Role = "Admin"'
      );
      userId = `ADM-${String(result[0].count + 1).padStart(5, '0')}`;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    await db.execute(
      'INSERT INTO users (UserID, FullName, Email, Password, Role, Status, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, fullName, email, hashedPassword, role.charAt(0).toUpperCase() + role.slice(1), 'A']
    );
    
    // Log activity
    await db.execute(
      'INSERT INTO activity_logs (UserID, Activity, Details, ActivityDate) VALUES (?, ?, ?, NOW())',
      [userId, 'registration', `New ${role} registered: ${fullName}`]
    );
    
    // Generate token
    const token = jwt.sign(
      { userId, email, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: userId,
        email,
        fullName,
        role: role.toLowerCase()
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    await db.execute(
      'INSERT INTO activity_logs (UserID, Activity, Details, ActivityDate) VALUES (?, ?, ?, NOW())',
      [req.user.userId, 'logout', 'User logged out']
    );
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT * FROM users WHERE UserID = ?',
      [req.user.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = users[0];
    res.json({
      id: user.UserID,
      email: user.Email,
      fullName: user.FullName,
      role: user.Role.toLowerCase(),
      departmentId: user.DeptID,
      batchYear: user.BatchYear
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// ==================== PROFILES ROUTES ====================

// Get profile
app.get('/api/profiles/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [users] = await db.execute(
      'SELECT * FROM users WHERE UserID = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const user = users[0];
    // Quick enrollment lookup for student year_level/block
    let year_level = user.CurrentYearLevel || user.BatchYear || null;
    let block = null;
    
    if (user.Role === 'Student') {
      const [enrollments] = await db.execute(`
        SELECT b.BlockCode, COALESCE(u.CurrentYearLevel, b.YearLevel) as year_level
        FROM student_enrollment se
        JOIN blocks b ON se.BlockID = b.BlockID
        LEFT JOIN users u ON se.StudentID = u.UserID
        WHERE se.StudentID = ? AND se.Status = 'E'
        LIMIT 1
      `, [userId]);
      
      if (enrollments.length > 0) {
        year_level = parseInt(enrollments[0].year_level) || year_level;
        block = enrollments[0].BlockCode;
      }
    }
    
    res.json({
      id: user.UserID,
      user_id: user.UserID,
      email: user.Email,
      full_name: user.FullName,
      student_id: user.UserID,
      department_id: user.DeptID,
      year_level: year_level,
      block: block,
      avatar_url: null,
      batch_year: user.BatchYear,
      status: user.Status,
      created_at: user.CreatedAt,
      updated_at: user.CreatedAt,
      last_login: user.LastLogin
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update profile
app.put('/api/profiles/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { full_name, department_id, year_level, avatar_url, batch_year } = req.body;
    
    await db.execute(
      `UPDATE users SET 
        FullName = COALESCE(?, FullName),
        DeptID = COALESCE(?, DeptID)
      WHERE UserID = ?`,
      [full_name, department_id, userId]
    );
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ==================== DEPARTMENTS ROUTES ====================

// Get all departments
app.get('/api/departments', authenticateToken, async (req, res) => {
  try {
    const [departments] = await db.execute(
      'SELECT * FROM departments WHERE Status = ? ORDER BY DeptName',
      ['A']
    );
    
    res.json(departments.map(d => ({
      id: d.DeptID,
      code: d.DeptCode,
      name: d.DeptName,
      status: d.Status,
      created_at: d.CreatedAt
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// ==================== PROGRAMS ROUTES ====================

// Get all programs
app.get('/api/programs', authenticateToken, async (req, res) => {
  try {
    const [programs] = await db.execute(
      'SELECT * FROM programs WHERE Status = ? ORDER BY ProgramName',
      ['A']
    );

    res.json(programs.map(p => ({
      id: p.ProgramID,
      code: p.ProgramCode,
      name: p.ProgramName,
      department_id: p.DeptID,
      status: p.Status,
      created_at: p.CreatedAt
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
});

// ==================== BLOCKS ROUTES ====================

// Get all blocks
app.get('/api/blocks', authenticateToken, async (req, res) => {
  try {
    const [blocks] = await db.execute(
      'SELECT BlockID as id, BlockCode as BlockName, SUBSTRING(BlockCode, 1, 3) as department_code FROM blocks WHERE Status = ? ORDER BY BlockCode',
      ['A']
    );
    res.json(blocks.map(b => ({
      id: b.id,
      department_code: b.department_code || b.BlockName?.substring(0,3).toUpperCase() || 'CSD'
    })));
  } catch (error) {
    console.error('Blocks fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
});

// ==================== NOTICES ROUTES ====================

// Get all notices
app.get('/api/notices', authenticateToken, async (req, res) => {
  try {
    const { category, priority, department_id, author_id, status } = req.query;
    
    let query = 'SELECT * FROM notices WHERE 1=1';
    const params = [];
    
    if (category) {
      query += ' AND Category = ?';
      params.push(category);
    }
    if (priority) {
      query += ' AND Priority = ?';
      params.push(priority);
    }
    if (department_id) {
      const deptParam = parseInt(department_id);
      query += ' AND DeptID = ?';
      params.push(deptParam);
    }
    if (author_id) {
      query += ' AND AuthorID = ?';
      params.push(author_id);
    }
    const statusLower = status ? status.toString().toLowerCase() : null;
    if (statusLower === 'active') {
      query += ' AND Status = "A" AND (ExpiryDate IS NULL OR ExpiryDate > NOW())';
    } else if (statusLower === 'draft') {
      query += ' AND Status = "D"';
    } else if (statusLower === 'expired') {
      query += ' AND Status = "A" AND ExpiryDate < NOW()';
    } else {
      query += ' AND Status = "A"';
    }
    
    query += ' ORDER BY IsPinned DESC, CreatedDate DESC';
    
    const [notices] = await db.execute(query, params);
    
    res.json(notices.map(n => ({
      id: n.NoticeID,
      title: n.Title,
      content: n.Content,
      category: n.Category,
      priority: n.Priority,
      author_id: n.AuthorID,
      created_at: n.CreatedDate,
      updated_at: n.UpdatedDate,
      expire_date: n.ExpiryDate,
      is_pinned: n.IsPinned === 'Y',
      is_published: n.Status === 'A',
      attachment_url: n.Attachment,
      department_id: n.DeptID,
      block_id: n.BlockID,
      subject_id: n.SubjectID,
      target_type: n.TargetType
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// Get single notice
app.get('/api/notices/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [notices] = await db.execute(
      'SELECT * FROM notices WHERE NoticeID = ?',
      [id]
    );
    
    if (notices.length === 0) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    
    const n = notices[0];
    res.json({
      id: n.NoticeID,
      title: n.Title,
      content: n.Content,
      category: n.Category,
      priority: n.Priority,
      author_id: n.AuthorID,
      created_at: n.CreatedDate,
      updated_at: n.UpdatedDate,
      expire_date: n.ExpiryDate,
      is_pinned: n.IsPinned === 'Y',
      is_published: n.Status === 'A',
      attachment_url: n.Attachment,
      department_id: n.DeptID,
      block_id: n.BlockID,
      subject_id: n.SubjectID,
      target_type: n.TargetType
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notice' });
  }
});

// Create notice
app.post('/api/notices', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      priority,
      department_id,
      block_id,
      subject_id,
      target_type,
      attachment_url,
      is_pinned,
      is_published,
      expire_date
    } = req.body;
    
    const [result] = await db.execute(
      `INSERT INTO notices 
        (Title, Content, Category, Priority, AuthorID, DeptID, BlockID, SubjectID, TargetType, Attachment, IsPinned, Status, ExpiryDate, CreatedDate) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        title,
        content,
        category || 'General',
        priority || 'Normal',
        req.user.userId,
        department_id || null,
        block_id || null,
        subject_id || null,
        target_type || 'All',
        attachment_url || null,
        is_pinned ? 'Y' : 'N',
        is_published ? 'A' : 'D',
        expire_date || null
      ]
    );
    
    // Log activity
    await db.execute(
      'INSERT INTO activity_logs (UserID, Activity, Details, ActivityDate) VALUES (?, ?, ?, NOW())',
      [req.user.userId, 'create_notice', `Created notice: ${title}`]
    );
    
    res.json({ id: result.insertId, message: 'Notice created successfully' });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

// Update notice
app.put('/api/notices/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      category,
      priority,
      department_id,
      block_id,
      subject_id,
      target_type,
      attachment_url,
      is_pinned,
      is_published,
      expire_date
    } = req.body;
    
    await db.execute(
      `UPDATE notices SET 
        Title = COALESCE(?, Title),
        Content = COALESCE(?, Content),
        Category = COALESCE(?, Category),
        Priority = COALESCE(?, Priority),
        DeptID = ?,
        BlockID = ?,
        SubjectID = ?,
        TargetType = COALESCE(?, TargetType),
        Attachment = ?,
        IsPinned = ?,
        Status = ?,
        ExpiryDate = ?,
        UpdatedDate = NOW()
      WHERE NoticeID = ?`,
      [
        title,
        content,
        category,
        priority,
        department_id,
        block_id,
        subject_id,
        target_type,
        attachment_url,
        is_pinned ? 'Y' : 'N',
        is_published ? 'A' : 'D',
        expire_date,
        id
      ]
    );
    
    // Log activity
    await db.execute(
      'INSERT INTO activity_logs (UserID, Activity, Details, ActivityDate) VALUES (?, ?, ?, NOW())',
      [req.user.userId, 'update_notice', `Updated notice ID: ${id}`]
    );
    
    res.json({ message: 'Notice updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notice' });
  }
});

// Delete notice
app.delete('/api/notices/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft delete
    await db.execute(
      'UPDATE notices SET Status = ? WHERE NoticeID = ?',
      ['D', id]
    );
    
    // Log activity
    await db.execute(
      'INSERT INTO activity_logs (UserID, Activity, Details, ActivityDate) VALUES (?, ?, ?, NOW())',
      [req.user.userId, 'delete_notice', `Deleted notice ID: ${id}`]
    );
    
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

// ==================== NOTICE READS ROUTES ====================

// Mark notice as read
app.post('/api/notice-reads', authenticateToken, async (req, res) => {
  try {
    const { notice_id } = req.body;
    
    // Check if already read
    const [existing] = await db.execute(
      'SELECT * FROM notice_read WHERE NoticeID = ? AND UserID = ?',
      [notice_id, req.user.userId]
    );
    
    if (existing.length > 0) {
      return res.json({ message: 'Already marked as read' });
    }
    
    await db.execute(
      'INSERT INTO notice_read (NoticeID, UserID, ReadDate) VALUES (?, ?, NOW())',
      [notice_id, req.user.userId]
    );
    
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// Get read status for notices
app.get('/api/notice-reads/bulk', authenticateToken, async (req, res) => {
  try {
    const { notice_ids } = req.query;
    if (!notice_ids) return res.json([]);

    const ids = notice_ids.toString().split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    if (ids.length === 0) return res.json([]);

    const placeholders = ids.map(() => '?').join(',');
    const [reads] = await db.execute(
      `SELECT * FROM notice_read WHERE UserID = ? AND NoticeID IN (${placeholders})`,
      [req.user.userId, ...ids]
    );

    res.json(reads);
  } catch (error) {
    console.error('Bulk read error:', error);
    res.status(500).json({ error: 'Failed to get read status' });
  }
});

// ==================== ACTIVITY LOGS ROUTES ====================

// Get activity logs
app.get('/api/activity-logs', authenticateToken, async (req, res) => {
  try {
    const { user_id, limit } = req.query;
    
    let query = 'SELECT * FROM activity_logs WHERE 1=1';
    const params = [];
    
    if (user_id) {
      query += ' AND UserID = ?';
      params.push(user_id);
    }
    
    query += ' ORDER BY ActivityDate DESC';
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }
    
    const [logs] = await db.execute(query, params);
    
    res.json(logs.map(l => ({
      id: l.LogID,
      user_id: l.UserID,
      activity: l.Activity,
      details: l.Details,
      created_at: l.ActivityDate,
      ip_address: l.IpAddress
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

// ==================== USERS ROUTES ====================

// Get all users (admin only)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const [users] = await db.execute(
      'SELECT UserID, FullName, Email, Role, BatchYear, LastLogin, Status, CreatedAt, DeptID FROM users ORDER BY CreatedAt DESC'
    );
    
    res.json(users.map(u => ({
      id: u.UserID,
      user_id: u.UserID,
      email: u.Email,
      full_name: u.FullName,
      role: u.Role.toLowerCase(),
      batch_year: u.BatchYear,
      last_login: u.LastLogin,
      status: u.Status,
      created_at: u.CreatedAt,
      department_id: u.DeptID
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role/status
app.put('/api/users/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { userId } = req.params;
    const { role, status, department_id } = req.body;
    
    await db.execute(
      `UPDATE users SET 
        Role = COALESCE(?, Role),
        Status = COALESCE(?, Status),
        DeptID = ?
      WHERE UserID = ?`,
      [role, status, department_id, userId]
    );
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ==================== STATS ROUTES ====================

// Get dashboard stats
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.execute('SELECT COUNT(*) as totalUsers FROM users WHERE Status = ?', ['A']);
    const [[{ totalNotices }]] = await db.execute('SELECT COUNT(*) as totalNotices FROM notices WHERE Status = ?', ['A']);
    const [[{ totalDepartments }]] = await db.execute('SELECT COUNT(*) as totalDepartments FROM departments WHERE Status = ?', ['A']);
    const [[{ totalPrograms }]] = await db.execute('SELECT COUNT(*) as totalPrograms FROM programs WHERE Status = ?', ['A']);
    
    // Get recent activity
    const [recentActivity] = await db.execute(
      'SELECT * FROM activity_logs ORDER BY ActivityDate DESC LIMIT 10'
    );
    
    res.json({
      totalUsers,
      totalNotices,
      totalDepartments,
      totalPrograms,
      recentActivity: recentActivity.map(l => ({
        id: l.LogID,
        user_id: l.UserID,
        activity: l.Activity,
        details: l.Details,
        created_at: l.ActivityDate
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Start server
app.get('/api/stats/analytics', authenticateToken, async (req, res) => {
  try {
    res.json({
      students: 150,
      faculty: 45,
      admins: 3,
      totalNotices: 10,
      readRate: 65,
      pendingNotices: 2
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

app.get('/api/notifications', authenticateToken, async (req, res) => {
  res.redirect('/api/notices');
});

app.get('/api/users/list', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const [users] = await db.execute(
      'SELECT UserID, FullName, Email, Role, Status FROM users WHERE Status = ?',
      ['A']
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ==================== STUDENTS ROUTES ====================

// Get student enrollment
app.get('/api/students/:studentId/enrollment', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const [enrollments] = await db.execute(`
      SELECT 
        p.ProgramName,
        p.ProgramCode,
        b.BlockCode,
        COALESCE(u.CurrentYearLevel, b.YearLevel) as year_level,

        b.Section,
        d.DeptCode as department_code,
        se.Semester,
        se.SchoolYear
      FROM student_enrollment se
      JOIN users u ON se.StudentID = u.UserID
      JOIN blocks b ON se.BlockID = b.BlockID
      JOIN programs p ON b.ProgramID = p.ProgramID
      JOIN departments d ON p.DeptID = d.DeptID
      WHERE se.StudentID = ? AND se.Status = 'E'

      LIMIT 1
    `, [studentId]);

    if (enrollments.length === 0) {
      return res.json({
        program: null,
        program_code: null,
        block: null,
        year_level: null,
        section: null,
        department_code: null,
        semester: null,
        school_year: null
      });
    }

    const enrollment = enrollments[0];
    res.json({
      program: enrollment.ProgramName,
      program_code: enrollment.ProgramCode,
      block: enrollment.BlockCode,
      year_level: enrollment.year_level ? parseInt(enrollment.year_level) : null,
      section: enrollment.Section,
      department_code: enrollment.department_code,
      semester: enrollment.Semester,
      school_year: enrollment.SchoolYear
    });
  } catch (error) {
    console.error('Enrollment query error:', error);
    res.status(500).json({ error: 'Enrollment lookup failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


