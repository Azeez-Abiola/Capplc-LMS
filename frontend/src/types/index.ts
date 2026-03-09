// ──────────────────────────────────────────
// Auth & User Types
// ──────────────────────────────────────────

export type UserRole = 'user' | 'admin'

export type SubscriptionTier = 'PRO' | 'ELITE'

export type SubscriptionStatus = 'active' | 'expired' | 'pending'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  whatsapp?: string
  state: string
  city?: string
  yearsOfExperience?: string
  paintingSpecialty?: string
  role: UserRole
  avatarUrl?: string
  createdAt: string
}

export interface Subscription {
  id: string
  userId: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  startDate: string
  expiryDate: string
  paymentStatus: 'paid' | 'pending'
  paymentReference?: string
}

// ──────────────────────────────────────────
// Course & Learning Types
// ──────────────────────────────────────────

export type CourseStatus = 'draft' | 'published'

export interface Course {
  id: string
  title: string
  description: string
  tierAccess: SubscriptionTier
  thumbnail?: string
  durationMinutes: number
  status: CourseStatus
  modules: Module[]
  createdAt: string
}

export interface Module {
  id: string
  courseId: string
  title: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  moduleId: string
  courseId: string
  title: string
  videoUrl: string
  durationMinutes: number
  order: number
  uploadDate: string
}

export interface CourseResource {
  id: string
  courseId: string
  title: string
  type: 'pdf' | 'slides' | 'worksheet'
  fileUrl: string
}

// ──────────────────────────────────────────
// Progress Tracking
// ──────────────────────────────────────────

export interface UserProgress {
  userId: string
  courseId: string
  moduleCompleted: boolean
  videoCompletionPercent: number
  courseCompleted: boolean
}

// ──────────────────────────────────────────
// Certificates
// ──────────────────────────────────────────

export interface Certificate {
  id: string
  userId: string
  courseName: string
  completionDate: string
  certificateUrl: string
  certificateNumber: string
}

// ──────────────────────────────────────────
// Payments
// ──────────────────────────────────────────

export type PaymentStatus = 'success' | 'failed' | 'pending'

export interface Payment {
  id: string
  userId: string
  transactionReference: string
  amount: number
  status: PaymentStatus
  paymentDate: string
}

// ──────────────────────────────────────────
// Analytics
// ──────────────────────────────────────────

export interface DashboardMetrics {
  totalUsers: number
  activeSubscriptions: number
  revenueGenerated: number
  courseCompletionRate: number
  videoEngagement: number
  monthlyRegistrations: number
  subscriptionConversionRate: number
  monthlyActiveUsers: number
}
