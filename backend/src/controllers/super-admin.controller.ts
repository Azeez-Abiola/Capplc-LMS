import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

/**
 * Get global platform metrics for super admin
 */
export const getPlatformOverview = async (req: Request, res: Response) => {
  try {
    // 1. Core stats
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [
      { count: totalCompanies },
      { count: activeSubscriptions },
      { count: totalPainters },
      { data: payments },
      { count: newCompanies },
      { count: newPainters },
      { count: freeTier },
      { count: proTier },
      { count: eliteTier }
    ] = await Promise.all([
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'super_admin'),
      supabase.from('payments').select('amount').eq('status', 'completed'),
      supabase.from('companies').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo.toISOString()),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'super_admin').gte('created_at', thirtyDaysAgo.toISOString()),
      supabase.from('companies').select('*', { count: 'exact', head: true }).eq('subscription_tier', 'FREE'),
      supabase.from('companies').select('*', { count: 'exact', head: true }).eq('subscription_tier', 'PRO'),
      supabase.from('companies').select('*', { count: 'exact', head: true }).eq('subscription_tier', 'ELITE')
    ])

    const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0

    res.json({
      totalCompanies: totalCompanies || 0,
      activeSubscriptions: activeSubscriptions || 0,
      totalPainters: totalPainters || 0,
      platformRevenue: totalRevenue,
      newCompanies: newCompanies || 0,
      newPainters: newPainters || 0,
      tiers: {
        free: freeTier || 0,
        pro: proTier || 0,
        elite: eliteTier || 0
      }
    })
  } catch (error: any) {
    console.error('[SUPER_ADMIN_OVERVIEW_ERROR]', error)
    res.status(500).json({ error: error.message })
  }
}

/**
 * Register a new company on the platform
 */
export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, max_users, max_video_upload, logo_url, subscription_tier, official_email, official_phone, address } = req.body
    
    // Generate unique 6-digit invitation code
    const invitation_code = Math.random().toString(36).substring(2, 8).toUpperCase()

    const { data: company, error } = await supabase
      .from('companies')
      .insert({
        name,
        max_users: max_users || 10,
        max_video_upload: max_video_upload || 5,
        logo_url,
        subscription_tier: subscription_tier || 'FREE',
        invitation_code,
        subscription_status: 'active',
        official_email,
        official_phone,
        address
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(company)
  } catch (error: any) {
    console.error('[SUPER_ADMIN_CREATE_COMPANY_ERROR]', error)
    res.status(500).json({ error: error.message })
  }
}

/**
 * Get list of all registered companies
 */
export const getCompaniesList = async (req: Request, res: Response) => {
  console.log('[DEBUG] getCompaniesList reached');
  try {
    const { data: companies, error } = await supabase
      .from('companies')
      .select(`
        *,
        painter_count:profiles!profiles_company_id_fkey(count)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Fetch revenue per company (this is heavy, in production use a view/cache)
    const { data: allPayments } = await supabase
      .from('payments')
      .select('amount, company_id')
      .eq('status', 'completed')

    const companyRevenue: Record<string, number> = {}
    allPayments?.forEach(p => {
      if (p.company_id) {
        companyRevenue[p.company_id] = (companyRevenue[p.company_id] || 0) + Number(p.amount)
      }
    })

    const formattedCompanies = companies.map(c => ({
      id: c.id,
      name: c.name,
      tier: c.subscription_tier,
      users: c.painter_count?.[0]?.count || 0,
      status: c.subscription_status || 'active',
      revenue: companyRevenue[c.id] || 0,
      logo_url: c.logo_url,
      official_email: c.official_email,
      official_phone: c.official_phone,
      address: c.address,
      max_users: c.max_users,
      max_video_upload: c.max_video_upload,
      createdAt: c.created_at
    }))

    res.json(formattedCompanies)
  } catch (error: any) {
    console.error('[SUPER_ADMIN_COMPANIES_ERROR]', error)
    res.status(500).json({ error: error.message })
  }
}

/**
 * Get platform-wide analytics
 */
export const getPlatformAnalytics = async (req: Request, res: Response) => {
  try {
    // 1. Weekly engagement (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const { data: engagement } = await supabase.rpc('get_weekly_engagement_stats') 
    // If RPC doesn't exist, we fallback to a simpler query or mock for now
    
    // 2. Course performance (Calculate manually since columns don't exist in courses table)
    const { data: coursesData } = await supabase
      .from('courses')
      .select('id, title')
      .limit(5)

    const courseMetrics = await Promise.all((coursesData || []).map(async (c) => {
      const { count: enrolled } = await supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('course_id', c.id)
      const { count: completions } = await supabase.from('certificates').select('*', { count: 'exact', head: true }).eq('course_id', c.id)
      return {
        title: c.title,
        enrolled: enrolled || 0,
        completions: completions || 0
      }
    }))

    // 3. KPI stats
    const [
      { count: totalUsers },
      { count: totalCompanies },
      { count: totalCerts },
      { count: enrollmentCount }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'super_admin'),
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase.from('certificates').select('*', { count: 'exact', head: true }),
      supabase.from('enrollments').select('*', { count: 'exact', head: true })
    ])

    res.json({
      kpis: [
        { label: 'Total Users', value: totalUsers || 0, change: '12', description: 'Active professionals' },
        { label: 'Active Companies', value: totalCompanies || 0, change: '2', description: 'B2B accounts' },
        { label: 'Certificates Issued', value: totalCerts || 0, change: '8', description: 'Credentials awarded' },
        { label: 'Total Enrollments', value: enrollmentCount || 0, change: '24', description: 'Total engagement' },
      ],
      growth: {
        users: 34,
        revenue: 28,
        retention: 92
      },
      courseMetrics,
      engagementTrend: engagement || [
        { day: 'Mon', value: 72 },
        { day: 'Tue', value: 85 },
        { day: 'Wed', value: 91 },
        { day: 'Thu', value: 68 },
        { day: 'Fri', value: 54 },
        { day: 'Sat', value: 30 },
        { day: 'Sun', value: 22 }
      ]
    })
  } catch (error: any) {
    console.error('[SUPER_ADMIN_ANALYTICS_ERROR]', error)
    res.status(500).json({ error: error.message })
  }
}

/**
 * Get revenue trend report
 */
export const getRevenueReport = async (req: Request, res: Response) => {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select('amount, created_at')
      .eq('status', 'completed')
      .order('created_at', { ascending: true })

    if (error) throw error

    // Group by month
    const monthlyData: Record<string, number> = {}
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    payments?.forEach(p => {
      const date = new Date(p.created_at)
      const key = `${months[date.getMonth()]}`
      monthlyData[key] = (monthlyData[key] || 0) + Number(p.amount)
    })

    const trend = months.map(m => ({
      month: m,
      amount: monthlyData[m] || 0
    })).filter(m => m.amount > 0 || months.indexOf(m.month) <= new Date().getMonth())

    // 4. Calculate Paying Companies & MRR
    const { data: companies } = await supabase
      .from('companies')
      .select('id, subscription_tier')
      .neq('subscription_tier', 'FREE')

    // Estimate MRR (In a real app, uses stripe/monnify subscription amounts)
    const mrr = companies?.reduce((sum, c) => {
      if (c.subscription_tier === 'PRO') return sum + 50000 // Sample 50k
      if (c.subscription_tier === 'ELITE') return sum + 150000 // Sample 150k
      return sum
    }, 0) || 0

    res.json({
      trend,
      totalRevenue: payments?.reduce((a, b) => a + Number(b.amount), 0) || 0,
      mrr,
      payingCompanies: companies?.length || 0
    })
  } catch (error: any) {
    console.error('[SUPER_ADMIN_REVENUE_ERROR]', error)
    res.status(500).json({ error: error.message })
  }
}

/**
 * Update an existing company
 */
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, max_users, max_video_upload, logo_url, subscription_tier, tier, status, official_email, official_phone, address } = req.body

    const { data: company, error } = await supabase
      .from('companies')
      .update({
        name,
        max_users,
        max_video_upload,
        logo_url,
        subscription_tier: subscription_tier || tier,
        subscription_status: status,
        official_email,
        official_phone,
        address,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json(company)
  } catch (error: any) {
    console.error('[SUPER_ADMIN_UPDATE_COMPANY_ERROR]', error)
    res.status(500).json({ error: error.message })
  }
}
