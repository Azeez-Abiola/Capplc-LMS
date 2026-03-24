import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

/**
 * Save current video timestamp
 */
export const syncVideoProgress = async (req: Request, res: Response) => {
  try {
    const { lesson_id, current_time, duration } = req.body
    const userId = req.user?.id

    if (!userId || !lesson_id) return res.status(400).json({ error: 'Missing required data' })

    const percent = Math.min(Math.round((current_time / duration) * 100), 100)
    const is_completed = percent >= 95

    const { data: progress, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        lesson_id,
        current_time,
        last_watched_at: new Date().toISOString(),
        is_completed
      })
      .select('*, modules(course_id)')
      .single()

    if (error) throw error

    // Update parent enrollment progress
    if (progress.modules?.course_id) {
      const courseId = progress.modules.course_id
      
      // Get all modules for this course
      const { data: allModules } = await supabase.from('modules').select('id').eq('course_id', courseId)
      const totalModules = allModules?.length || 0
      
      if (totalModules > 0) {
        // Get completed modules for this user in this course
        const { count: completedCount } = await supabase
          .from('user_progress')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_completed', true)
          .in('lesson_id', (allModules || []).map(m => m.id))

        const newProgress = Math.round(((completedCount || 0) / totalModules) * 100)
        
        await supabase
          .from('enrollments')
          .update({ progress: newProgress, status: newProgress === 100 ? 'completed' : 'active' })
          .eq('user_id', userId)
          .eq('course_id', courseId)

        if (newProgress === 100) {
          // Check if certificate already exists
          const { data: existingCert } = await supabase
            .from('certificates')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .maybeSingle()

          if (!existingCert) {
            console.log(`[CERT] Course ${courseId} complete for user ${userId}. Issuing certificate...`)
            const { issueCertificateInternal } = require('./certificate.controller')
            await issueCertificateInternal(userId, courseId)
          }
        }
      }
    }

    res.json(progress)
  } catch (error: any) {
    console.error('[PROGRESS_SYNC_ERROR]', error.message)
    res.status(500).json({ error: error.message })
  }
}

/**
 * Mark a lesson or module as complete
 */
export const markComplete = async (req: Request, res: Response) => {
  try {
    const { lesson_id } = req.body
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        lesson_id,
        is_completed: true,
        completed_at: new Date().toISOString()
      })
      .select()

    if (error) throw error

    res.json(data[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Get user progress for a specific course
 */
export const getCourseProgress = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('user_progress')
      .select('*, modules!inner(course_id)')
      .eq('user_id', userId)
      .eq('modules.course_id', courseId)

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
