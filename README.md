# 🎓 Bicol University Student Notice System

The **Bicol University Student Notice System** is a centralized platform designed to efficiently manage and distribute official university announcements. It ensures students receive important notices on time while allowing teachers, staff, and faculty to manage announcements in an organized way.

---

## 📌 Features

### Admin (Teachers / Staff)
- Create, edit, and delete announcements  
- Categorize announcements (Exam, Events, Class, General)  
- Set announcement priority (Normal or Urgent)  
- User and department management
- Analytics and activity logs  

### Faculty
- Create and manage their notices
- View read statistics
- Activity logs and profile management

### Students
- View the latest announcements  
- Filter announcements by category and department
- View urgent notices
- Mark announcements as read and track read status
- Dashboard statistics

---

## 🧩 Problem Statement

- Announcements are scattered across different platforms  
- Students often miss important or urgent notices  
- No centralized system for official announcements  
- Announcements are not properly categorized or prioritized  
- Students cannot track read and unread announcements  

---

## 💡 System Description

The Bicol University Student Notice System provides a **centralized notice board** where administrators can manage announcements and students can easily view, filter, and track important information. This improves communication and ensures timely delivery of official notices within the university.

---

## 🛠️ Technologies Used

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui components
- React Router, TanStack Query, Recharts, Lucide React

**Backend:**
- Node.js + Express.js
- MySQL database
- JWT authentication, bcrypt

**Development:**
- XAMPP (MySQL)
- npm for package management

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- XAMPP (MySQL)
- MySQL database `ibu-notice-system`

### 1. Clone & Install Frontend
```bash
cd iBU-Notice-System
npm install
```

### 2. Setup Backend
```bash
cd server
npm install
```

### 3. Database Setup
- Start XAMPP MySQL
- Create database: `CREATE DATABASE ibu-notice-system;`
- Run seed scripts:
  ```bash
  # In MySQL workbench or phpMyAdmin
  source setup-student-data.sql;
  source seed-student-enrollments.sql;
  ```

### 4. Run Servers
**Backend (Terminal 1):**
```bash
cd server
node index.js
```
*Server running on http://localhost:3001*

**Frontend (Terminal 2):**
```bash
npm run dev
```
*App running on http://localhost:8080 (proxies /api to backend)*

### 5. Login
- Admin/Faculty/Student credentials seeded in DB

---

## 📁 Project Structure

```
iBU-Notice-System/
├── public/              # Static assets (logos)
├── server/              # Node.js/Express API + MySQL
│   ├── db.js           # MySQL connection
│   ├── index.js        # Express server
│   └── *.sql           # DB seeds
├── src/                 # React app
│   ├── components/     # shadcn/ui + custom components (role-based)
│   ├── pages/          # Role dashboards (admin/faculty/student)
│   ├── hooks/          # Custom hooks (auth, notifications)
│   └── integrations/   # API + Supabase clients
├── package.json        # Frontend deps & scripts
└── tailwind.config.ts  # Tailwind + shadcn config
```

---

## 👥 Stakeholders

- **Admin (Developer)** – Manage and post announcements, users, analytics  
- **Faculty(Faculty)** – Create/manage notices, view stats  
- **Students** – View, filter, track announcements  

---

## 👨‍👩‍👧‍👦 Contributors

**Group 2**
- John Drex Cantor  
- Rafael Baltasar  
- Eunice Lozano  
- Sandy Murillo  
- Keira Latasha Creollo  
- Marife Son  

---

**Live Demo:** http://localhost:8080  
**API Docs:** Check backend routes in `server/index.js`

