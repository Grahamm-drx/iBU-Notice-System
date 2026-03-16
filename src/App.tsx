import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth pages
import StudentLogin from "./pages/StudentLogin";
import FacultyLogin from "./pages/FacultyLogin";
import AdminLogin from "./pages/AdminLogin";

// Dashboard pages - Student
import {
  StudentDashboardPage,
  AllNoticesPage,
  UrgentNoticesPage,
  DepartmentNoticesPage,
  ReadTrackingPage,
  StudentProfilePage,
} from './pages/student';

// Dashboard pages - Faculty
import {
  FacultyDashboardPage as FacultyDashboard,
  MyNoticesPage,
  CreateNoticePage,
  ReadStatisticsPage,
  FacultyActivityLogsPage,
  FacultyProfilePage,
} from './pages/faculty';

// Admin Dashboard pages
import {
  AdminDashboardPage,
  NoticeManagementPage,
  CreateEditNoticePage,
  UserManagementPage,
  DepartmentManagementPage,
  AnalyticsPage,
  ActivityLogsPage,
  AdminSettingsPage,
} from "./pages/admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Student Routes */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/notices" element={<AllNoticesPage />} />
            <Route path="/student/urgent" element={<UrgentNoticesPage />} />
            <Route path="/student/department" element={<DepartmentNoticesPage />} />
            <Route path="/student/tracking" element={<ReadTrackingPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            
            {/* Faculty Routes */}
            <Route path="/faculty/login" element={<FacultyLogin />} />
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/faculty/notices" element={<MyNoticesPage />} />
            <Route path="/faculty/notices/create" element={<CreateNoticePage />} />
            <Route path="/faculty/statistics" element={<ReadStatisticsPage />} />
            <Route path="/faculty/logs" element={<FacultyActivityLogsPage />} />
            <Route path="/faculty/profile" element={<FacultyProfilePage />} />
            
            {/* Admin Routes - New comprehensive dashboard */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/notices" element={<NoticeManagementPage />} />
            <Route path="/admin/notices/create" element={<CreateEditNoticePage />} />
            <Route path="/admin/notices/edit/:id" element={<CreateEditNoticePage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/departments" element={<DepartmentManagementPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="/admin/logs" element={<ActivityLogsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
