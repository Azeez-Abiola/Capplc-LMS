import api from '../lib/axios'

export interface AdminStats {
  totalUsers: number
  totalCourses: number
  totalCertificates: number
  activeSubscriptions: number
  revenue: number
  dailyEngagement: number
  growth: number
}

export interface UserStats {
  enrolledCourses: number
  completedCourses: number
  certificatesIssued: number
  totalXp: number
  enrolledCourseData?: any[]
}

export const analyticsService = {
  async getAdminStats(): Promise<AdminStats> {
    const { data } = await api.get('analytics/admin')
    return data
  },

  async getUserStats(): Promise<UserStats> {
    const { data } = await api.get('analytics/user')
    return data
  },

  async getDetailedEngagementAdmin(): Promise<any> {
    const { data } = await api.get('analytics/admin/detailed')
    return data
  }
}
