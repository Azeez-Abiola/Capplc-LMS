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
      .select('*, lessons(course_id)')
      .single()

    if (error) throw error

    // If lesson marked as completed, check if entire course is completed
    if (is_completed && progress.lessons?.course_id) {
      const courseId = progress.lessons.course_id

      // 1. Get all lessons in this course
      const { data: allLessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId)

      // 2. Get user's completed lessons in this course
      const { data: completedLessons } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('is_completed', true)
        .in('lesson_id', (allLessons || []).map(l => l.id))

      if (allLessons && completedLessons && allLessons.length === completedLessons.length) {
        // Course is fully complete!
        // 3. Check if certificate already exists
        const { data: existingCert } = await supabase
          .from('certificates')
          .select('id')
          .eq('user_id', userId)
          .eq('course_id', courseId)
          .maybeSingle()

        if (!existingCert) {
          // 4. Issue Certificate (Internal call or simplified logic)
          console.log(`[CERT] Course ${courseId} complete for user ${userId}. Issuing certificate...`)
          // We can't easily call res.redirect or imported controller directly here 
          // to send a response twice, so we just trigger the logic...
          // For now, I'll rely on a manual trigger or an automated internal function I'll add to a shared service.
          const { issueCertificateInternal } = require('./certificate.controller')
          await issueCertificateInternal(userId, courseId)
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
      .select('*, lessons!inner(course_id)')
      .eq('user_id', userId)
      .eq('lessons.course_id', courseId)

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
