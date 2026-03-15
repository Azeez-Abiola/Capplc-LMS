import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'
import SuperAdminLayout from './layouts/SuperAdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import EmailVerification from './pages/auth/EmailVerification'
import ForgotPassword from './pages/auth/ForgotPassword'

// Painter Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard'
import MyCourses from './pages/dashboard/MyCourses'
import CourseDetail from './pages/dashboard/CourseDetail'
import VideoLibrary from './pages/dashboard/VideoLibrary'
import VideoPlayer from './pages/dashboard/VideoPlayer'
import MyProgress from './pages/dashboard/MyProgress'
import Certificates from './pages/dashboard/Certificates'
import Subscription from './pages/dashboard/Subscription'
import PaymentStatus from './pages/dashboard/PaymentStatus'
import Profile from './pages/dashboard/Profile'

// Admin Pages (lazy loaded)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const UserDetails = lazy(() => import('./pages/admin/UserDetails'))
const CourseManagement = lazy(() => import('./pages/admin/CourseManagement'))
const PaymentsMonitor = lazy(() => import('./pages/admin/PaymentsMonitor'))
const Analytics = lazy(() => import('./pages/admin/Analytics'))
const CertificateManagement = lazy(() => import('./pages/admin/CertificateManagement'))
const ContentUpload = lazy(() => import('./pages/admin/ContentUpload'))

// Super Admin Pages (lazy loaded)
const SuperAdminDashboard = lazy(() => import('./pages/super-admin/SuperAdminDashboard'))
const SuperAdminCompanies = lazy(() => import('./pages/super-admin/SuperAdminCompanies'))
const SuperAdminRevenue = lazy(() => import('./pages/super-admin/SuperAdminRevenue'))
const SuperAdminAnalytics = lazy(() => import('./pages/super-admin/SuperAdminAnalytics'))
const SuperAdminCompanyDetail = lazy(() => import('./pages/super-admin/SuperAdminCompanyDetail'))

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
  </div>
)

export default function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
    <Routes>
      {/* ── Auth Routes (public) ── */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* ── Painter Dashboard (protected, role: painter) ── */}
      <Route element={<ProtectedRoute allowedRoles={['painter']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
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
      </Route>

      {/* ── Company Admin Dashboard (protected, role: admin) ── */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/users/:id" element={<UserDetails />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
          <Route path="/admin/payments" element={<PaymentsMonitor />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/certificates" element={<CertificateManagement />} />
          <Route path="/admin/content" element={<ContentUpload />} />
          <Route path="/admin/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* ── Super Admin (protected, role: super_admin) ── */}
      <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
        <Route element={<SuperAdminLayout />}>
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/companies" element={<SuperAdminCompanies />} />
          <Route path="/super-admin/companies/:id" element={<SuperAdminCompanyDetail />} />
          <Route path="/super-admin/revenue" element={<SuperAdminRevenue />} />
          <Route path="/super-admin/analytics" element={<SuperAdminAnalytics />} />
          <Route path="/super-admin/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Fallback — redirect unknown paths to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  )
}
