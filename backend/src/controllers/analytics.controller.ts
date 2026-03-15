import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.user_metadata?.role || 'painter'
    const isSuperAdmin = userRole === 'super_admin'
    
    // Fetch user's company_id for filtering if they are a regular admin
    let userCompanyId: string | null = null
    if (!isSuperAdmin && req.user?.id) {
      const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', req.user.id).maybeSingle()
      userCompanyId = profile?.company_id || null
    }

    // Base queries
    let profilesQuery = supabase.from('profiles').select('*', { count: 'exact', head: true })
    let coursesQuery = supabase.from('courses').select('*', { count: 'exact', head: true })
    let certsQuery = supabase.from('certificates').select('*', { count: 'exact', head: true })
    let subsQuery = supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
    let paymentsQuery = supabase.from('payments').select('amount').eq('status', 'completed')

    // Apply company filters for regular admins
    if (userCompanyId) {
      profilesQuery = profilesQuery.eq('company_id', userCompanyId).neq('role', 'super_admin')
      certsQuery = certsQuery.eq('company_id', userCompanyId)
      subsQuery = subsQuery.in('user_id', (await supabase.from('profiles').select('id').eq('company_id', userCompanyId)).data?.map(p => p.id) || [])
      paymentsQuery = paymentsQuery.eq('company_id', userCompanyId)
    }

    const [
      { count: userCount, error: userErr }, 
      { count: courseCount, error: courseErr }, 
      { count: certCount, error: certErr },
      { count: activeSubs, error: subErr },
      { data: payments, error: payErr }
    ] = await Promise.all([
      profilesQuery,
      coursesQuery,
      certsQuery,
      subsQuery,
      paymentsQuery
    ])

    if (userErr) console.error('[STATS_ERROR] Profiles:', userErr.message)
    if (courseErr) console.error('[STATS_ERROR] Courses:', courseErr.message)
    if (certErr) console.error('[STATS_ERROR] Certificates:', certErr.message)
    if (subErr) console.error('[STATS_ERROR] Subscriptions:', subErr.message)

    const totalRevenue = payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0

    // 3. Daily Engagement (Active users in last 24h)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const { count: activeUsers, error: progErr } = await supabase
      .from('user_progress')
      .select('user_id', { count: 'exact', head: true })
      .gte('last_watched_at', yesterday.toISOString())

    if (progErr) console.error('[STATS_ERROR] Progress:', progErr.message)

    // 4. Fetch Company Name
    let companyName = 'Global HQ'
    if (userCompanyId) {
      const { data: company } = await supabase.from('companies').select('name').eq('id', userCompanyId).single()
      if (company) companyName = company.name
    }

    // 5. Fetch Recent Users
    let recentUsersQuery = supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5)
    if (userCompanyId) {
      recentUsersQuery = recentUsersQuery.eq('company_id', userCompanyId).neq('role', 'super_admin')
    }
    const { data: recentUsers } = await recentUsersQuery

    res.json({
      totalUsers: userCount || 0,
      totalCourses: courseCount || 0,
      totalCertificates: certCount || 0,
      activeSubscriptions: activeSubs || 0,
      revenue: totalRevenue,
      dailyEngagement: activeUsers || 0,
      growth: 12.5,
      companyName,
      recentUsers: recentUsers || []
    })
  } catch (error: any) {
    console.error('[ANALYTICS_ADMIN_FATAL]', error)
    res.status(500).json({ error: 'Failed to load platform statistics' })
  }
}

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    // 1. Fetch statistics with safe destructuring
    const [enrollmentRes, progressRes, certRes] = await Promise.all([
      supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('user_progress').select('is_completed').eq('user_id', userId),
      supabase.from('certificates').select('*', { count: 'exact', head: true }).eq('user_id', userId)
    ])

    if (enrollmentRes.error) console.error('[STATS_ERROR] Enrollments:', enrollmentRes.error.message)
    if (progressRes.error) console.error('[STATS_ERROR] Progress:', progressRes.error.message)
    if (certRes.error) console.error('[STATS_ERROR] Certificates:', certRes.error.message)

    const completedCount = progressRes.data?.filter(p => !!p.is_completed).length || 0

    // 2. Fetch actually enrolled courses with details
    const { data: enrolledCourses, error: courseErr } = await supabase
      .from('enrollments')
      .select(`
        id,
        status,
        course_id,
        courses (
          id,
          title,
          description,
          thumbnail_url,
          tier_access
        )
      `)
      .eq('user_id', userId)
      .limit(5)

    if (courseErr) console.error('[STATS_ERROR] Courses Join:', courseErr.message)

    res.json({
      enrolledCourses: enrollmentRes.count || 0,
      completedCourses: completedCount,
      certificatesIssued: certRes.count || 0,
      totalXp: completedCount * 100,
      enrolledCourseData: enrolledCourses || []
    })
  } catch (error: any) {
    console.error('[ANALYTICS_USER_FATAL]', error)
    res.status(500).json({ error: 'Internal analytics error' })
  }
}

/**
 * Admin: Get detailed monthly activity for the last 12 months
 */
export const getDetailedEngagement = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.user_metadata?.role || 'painter'
    const isSuperAdmin = userRole === 'super_admin'
    
    let userCompanyId: string | null = null
    if (!isSuperAdmin && req.user?.id) {
       const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', req.user.id).maybeSingle()
       userCompanyId = profile?.company_id || null
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentYear = new Date().getFullYear()
    
    // Monthly activity - profiles 
    let profQuery = supabase.from('profiles').select('created_at').gte('created_at', `${currentYear}-01-01`)
    if (userCompanyId) profQuery = profQuery.eq('company_id', userCompanyId)
    
    const { data: profiles, error } = await profQuery

    if (error) throw error

    const monthlyData = months.map(m => 0)
    profiles?.forEach(p => {
      const date = new Date(p.created_at)
      if (date.getFullYear() === currentYear) {
        monthlyData[date.getMonth()]++
      }
    })

    // Certificate distribution
    let certDistQuery = supabase.from('certificates').select('course_id, courses(tier_access)')
    if (userCompanyId) certDistQuery = certDistQuery.eq('company_id', userCompanyId)
    
    const { data: certs } = await certDistQuery

    const distribution: any = {
      'ELITE': 0,
      'PRO': 0,
      'free': 0
    }

    certs?.forEach((c: any) => {
      const tier = c.courses?.tier_access || 'free'
      if (distribution[tier] !== undefined) {
        distribution[tier]++
      }
    })

    // Recent Activity (Live Activity)
    // We'll fetch from enrollments joined with profiles and courses
    let activityQuery = supabase
      .from('enrollments')
      .select(`
        created_at,
        status,
        profiles (first_name, last_name, company_id),
        courses (title)
      `)
      .order('created_at', { ascending: false })
      .limit(6)

    if (userCompanyId) {
       // Filter by company via inner join or mapping
       activityQuery = activityQuery.eq('profiles.company_id', userCompanyId)
    }

    const { data: recentEvents } = await activityQuery

    const formattedEvents = (recentEvents || []).map((ev: any) => {
       const now = new Date()
       const then = new Date(ev.created_at)
       const diff = Math.floor((now.getTime() - then.getTime()) / 60000)
       let timeStr = diff < 60 ? `${diff}m ago` : diff < 1440 ? `${Math.floor(diff/60)}h ago` : `${Math.floor(diff/1440)}d ago`
       if (diff < 1) timeStr = 'Just now'

       return {
          user_name: `${ev.profiles?.first_name} ${ev.profiles?.last_name?.charAt(0)}.`,
          action_type: ev.status === 'completed' ? 'Completed' : 'Started',
          resource_name: ev.courses?.title,
          time_ago: timeStr
       }
    })

    res.json({
      activity: monthlyData,
      distribution: [
        { label: 'Elite Mastery', value: distribution['ELITE'] },
        { label: 'Pro Professional', value: distribution['PRO'] },
        { label: 'Standard Practical', value: distribution['free'] }
      ],
      recentActivity: formattedEvents
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
