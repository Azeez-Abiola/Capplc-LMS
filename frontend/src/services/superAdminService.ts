import api from '../lib/axios'

export interface PlatformStats {
  totalCompanies: number
  activeSubscriptions: number
  totalPainters: number
  platformRevenue: number
  newCompanies?: number
  newPainters?: number
  tiers?: {
    free: number
    pro: number
    elite: number
  }
}

export interface CompanyRegistryEntry {
  id: string | number
  name: string
  tier: string
  users: number
  status: 'active' | 'pending' | 'suspended'
  revenue: number
  logo_url? : string
  official_email?: string
  official_phone?: string
  address?: string
  max_users?: number
  max_video_upload?: number
  createdAt?: string
}

export interface RevenueMetric {
  month: string
  amount: number
}

export interface CompanyRevenue {
  name: string
  revenue: number
  tier: string
  growth: number
  logo_url?: string
}

export interface AnalyticsKPI {
  label: string
  value: string | number
  change: string
  description: string
}

export interface CourseMetric {
  title: string
  completions: number
  enrolled: number
  avgScore?: number
}

export interface EngagementMetric {
  day: string
  value: number
}

export const superAdminService = {
  async getPlatformStats(): Promise<PlatformStats> {
    const { data } = await api.get('super-admin/overview')
    return data
  },

  async getCompanies(): Promise<CompanyRegistryEntry[]> {
    const { data } = await api.get('super-admin/companies')
    return data
  },

  async getRevenueTrend(): Promise<{ trend: RevenueMetric[]; mrr: number; payingCompanies: number; totalRevenue: number }> {
    const { data } = await api.get('super-admin/revenue')
    return data
  },

  async getTopCompaniesRevenue(): Promise<CompanyRevenue[]> {
    // This could also be a sub-endpoint or derived from getCompanies
    const companies = await this.getCompanies()
    return companies
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(c => ({
        name: c.name,
        revenue: c.revenue,
        tier: c.tier,
        growth: 0, // In a real app, calculate this
        logo_url: c.logo_url
      }))
  },

  async getAnalyticsKPIs(): Promise<{ kpis: AnalyticsKPI[]; growth: { users: number; revenue: number; retention: number } }> {
    const { data } = await api.get('super-admin/analytics')
    return { kpis: data.kpis, growth: data.growth }
  },

  async getCourseMetrics(): Promise<CourseMetric[]> {
    const { data } = await api.get('super-admin/analytics')
    return data.courseMetrics
  },

  async getWeeklyEngagement(): Promise<EngagementMetric[]> {
    const { data } = await api.get('super-admin/analytics')
    return data.engagementTrend
  },

  async createCompany(companyData: { 
    name: string; 
    max_users?: number; 
    max_video_upload?: number; 
    logo_url?: string; 
    subscription_tier?: string;
    official_email?: string;
    official_phone?: string;
    address?: string;
  }): Promise<CompanyRegistryEntry> {
    const { data } = await api.post('super-admin/companies', companyData)
    return data
  },

  async updateCompany(id: string | number, companyData: Partial<CompanyRegistryEntry>): Promise<CompanyRegistryEntry> {
    const { data } = await api.put(`super-admin/companies/${id}`, companyData)
    return data
  }
}
