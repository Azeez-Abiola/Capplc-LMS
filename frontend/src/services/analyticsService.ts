import api from '../lib/axios'

export interface AdminStats {
  totalUsers: number
  totalCourses: number
  totalCertificates: number
  activeSubscriptions: number
  revenue: number
  growth: number
}

export interface UserStats {
  enrolledCourses: number
  completedCourses: number
  certificatesIssued: number
  totalXp: number
}

export const analyticsService = {
  async getAdminStats(): Promise<AdminStats> {
    const { data } = await api.get('analytics/admin')
    return data
  },

  async getUserStats(): Promise<UserStats> {
    const { data } = await api.get('analytics/user')
    return data
  }
}
