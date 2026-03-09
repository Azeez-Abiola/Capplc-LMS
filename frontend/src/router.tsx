import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'

// Public / Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import EmailVerification from './pages/auth/EmailVerification'
import ForgotPassword from './pages/auth/ForgotPassword'

// User dashboard pages
import Dashboard from './pages/dashboard/Dashboard'
import MyCourses from './pages/dashboard/MyCourses'
import CourseDetail from './pages/dashboard/CourseDetail'
import VideoLibrary from './pages/dashboard/VideoLibrary'
import VideoPlayer from './pages/dashboard/VideoPlayer'
import MyProgress from './pages/dashboard/MyProgress'
import Certificates from './pages/dashboard/Certificates'
import Subscription from './pages/dashboard/Subscription'
import Profile from './pages/dashboard/Profile'
import PaymentStatus from './pages/dashboard/PaymentStatus'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import CourseManagement from './pages/admin/CourseManagement'
import ContentUpload from './pages/admin/ContentUpload'
import PaymentsMonitor from './pages/admin/PaymentsMonitor'
import Analytics from './pages/admin/Analytics'
import CertificateManagement from './pages/admin/CertificateManagement'

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Auth Routes ── */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* ── User Dashboard Routes (PRD COMPLIANT) ── */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<MyCourses />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/video-library" element={<VideoLibrary />} />
        <Route path="/play/:id" element={<VideoPlayer />} />
        <Route path="/progress" element={<MyProgress />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
        <Route path="/profile" element={<Profile />} />
        
      </Route>

      {/* ── Admin Routes (PRD COMPLIANT) ── */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/content" element={<ContentUpload />} />
        <Route path="/admin/courses" element={<CourseManagement />} />
        <Route path="/admin/payments" element={<PaymentsMonitor />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/certificates" element={<CertificateManagement />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
