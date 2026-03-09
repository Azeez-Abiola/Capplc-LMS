import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    // Fetch total users
    const { count: userCount, error: userError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Fetch total courses
    const { count: courseCount, error: courseError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })

    // Fetch total certificates issued
    const { count: certCount, error: certError } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })

    // Fetch active subscriptions count (example)
    const { count: subCount, error: subError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    res.json({
      totalUsers: userCount || 0,
      totalCourses: courseCount || 0,
      totalCertificates: certCount || 0,
      activeSubscriptions: subCount || 0,
      revenue: 1250000, // Hardcoded for demo
      growth: 12.5
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    // Fetch user progress, courses, certificates
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId)

    const { data: certificates, error: certError } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)

    res.json({
      enrolledCourses: enrollments?.length || 0,
      completedCourses: enrollments?.filter(e => e.status === 'completed').length || 0,
      certificatesIssued: certificates?.length || 0,
      totalXp: (enrollments?.length || 0) * 150
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
