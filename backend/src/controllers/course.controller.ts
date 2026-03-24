import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

// ─── Get all published courses (excludes archived) ──────────────
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { status, tier } = req.query

    let query = supabase
      .from('courses')
      .select('*, modules(id, title, order), module_count:modules(count)')
      // .is('archived_at', null) // Temporarily disabled until migration
      .order('created_at', { ascending: false })

    // Optional filters
    if (status === 'published') {
      query = query.eq('is_published', true)
    } else if (status === 'draft') {
      query = query.eq('is_published', false)
    }
    
    if (tier) query = query.eq('tier_access', tier)

    const { data, error } = await query

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// ─── Get all courses including archived (Admin) ─────────────────
export const getAllCoursesAdmin = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*, modules(id, title, order)')
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// ─── Get single course by ID ────────────────────────────────────
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('courses')
      .select('*, modules(*, lessons(*)), module_count:modules(count)')
      .eq('id', id)
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// ─── Create a new course ────────────────────────────────────────
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, tier_access, level, thumbnail, duration_minutes, status, video_url } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Course title is required' })
    }

    const courseData = {
      title,
      description: description || '',
      tier_access: tier_access || 'free',
      level: level || 'Beginner',
      thumbnail_url: thumbnail || req.body.thumbnail_url || null,
      video_url: video_url || req.body.video_url || null,
      duration: duration_minutes ? duration_minutes.toString() : '0',
      is_published: status === 'published' || status === 'active' || req.body.is_published === true
    }
    // Insert into database
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single()

    if (error) {
      console.error('[COURSE_CREATE_DB_ERROR]', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        table: 'courses',
        sentData: courseData
      })
      return res.status(500).json({ 
        message: 'Database error during course creation', 
        error: error.message,
        code: error.code 
      })
    }
    if (!data) { // Changed from data.length === 0 because .single() returns null for no data
      throw new Error('Failed to create course - no data returned')
    }

    res.status(201).json(data) // data is already the single object
  } catch (error: any) {
    console.error('[COURSE_CREATE_ERROR] Server Error:', error.message)
    res.status(500).json({ error: error.message })
  }
}

// ─── Update a course (PATCH) ────────────────────────────────────
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, description, tier_access, level, thumbnail, duration_minutes, status, video_url } = req.body

    const updateData: any = {}
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (tier_access) updateData.tier_access = tier_access
    if (level) updateData.level = level
    if (thumbnail !== undefined || req.body.thumbnail_url !== undefined) {
      updateData.thumbnail_url = thumbnail || req.body.thumbnail_url
    }
    if (video_url !== undefined || req.body.video_url !== undefined) {
      updateData.video_url = video_url || req.body.video_url
    }
    if (duration_minutes) updateData.duration = duration_minutes.toString()
    if (status !== undefined || req.body.is_published !== undefined) {
      updateData.is_published = (status === 'published' || status === 'active' || req.body.is_published === true)
    }

    const { data, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('[COURSE_UPDATE_ERROR] Database Error:', error.message)
      throw error
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Course not found' })
    }

    res.json(data[0])
  } catch (error: any) {
    console.error('[COURSE_UPDATE_ERROR] Server Error:', error.message)
    res.status(500).json({ error: error.message })
  }
}

// ─── Soft-delete (archive) a course ─────────────────────────────
export const archiveCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Try to update archived_at, but handle missing column error by falling back to just is_published
    const updatePayload: any = { is_published: false }
    
    // Check if we can use archived_at
    try {
      updatePayload.archived_at = new Date().toISOString()
      const { data, error } = await supabase
        .from('courses')
        .update(updatePayload)
        .eq('id', id)
        .select()

      if (error) {
        // If archived_at column missing, retry without it
        if (error.code === '42703') { // undefined_column
          delete updatePayload.archived_at
          const { data: retryData, error: retryError } = await supabase
            .from('courses')
            .update(updatePayload)
            .eq('id', id)
            .select()
          
          if (retryError) throw retryError
          return res.json({ message: 'Course archived (partial)', course: retryData[0] })
        }
        throw error
      }
      
      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Course not found' })
      }

      res.json({ message: 'Course archived successfully', course: data[0] })
    } catch (err: any) {
      console.error('[COURSE_ARCHIVE_ERROR]', err.message)
      throw err
    }
  } catch (error: any) {
    console.error('[COURSE_ARCHIVE_ERROR] Server Error:', error.message)
    res.status(500).json({ error: error.message })
  }
}

// ─── Restore an archived course ─────────────────────────────────
export const restoreCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('courses')
      .update({
        archived_at: null,
        is_published: false // Default to false when restored
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('[COURSE_RESTORE_ERROR] Database Error:', error.message)
      throw error
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Course not found' })
    }

    res.json({ message: 'Course restored successfully', course: data[0] })
  } catch (error: any) {
    console.error('[COURSE_RESTORE_ERROR] Server Error:', error.message)
    res.status(500).json({ error: error.message })
  }
}

// ─── Hard delete a course (Admin emergency) ─────────────────────
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.status(204).send()
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// ─── Enroll in a course ─────────────────────────────────────────
export const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { courseId } = req.body

    if (!userId || !courseId) {
      return res.status(400).json({ error: 'Missing user or course ID' })
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle()

    if (existing) {
      return res.json({ message: 'Already enrolled', enrollment: existing })
    }

    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .insert([
        { 
          user_id: userId, 
          course_id: courseId, 
          status: 'enrolled',
          progress: 0
        }
      ])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(enrollment)
  } catch (error: any) {
    console.error('[ENROLL_ERROR]', error.message)
    res.status(500).json({ error: error.message })
  }
}

// ─── Get enrolled courses for current user ──────────────────────
export const getEnrolledCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    // Fetch enrollments with course details
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select('*, courses(*, modules(id, title, order), module_count:modules(count))')
      .eq('user_id', userId)

    if (error) throw error

    // Fetch all user progress to find last positions
    const { data: allProgress } = await supabase
      .from('user_progress')
      .select('*, modules(course_id, title)')
      .eq('user_id', userId)

    const enriched = (enrollments || []).map(enrollment => {
      const courseId = enrollment.course_id
      const latestProg = allProgress?.filter(p => p.modules?.course_id === courseId)
        .sort((a, b) => new Date(b.last_watched_at).getTime() - new Date(a.last_watched_at).getTime())[0]

      let lastPosition = '00:00'
      if (latestProg?.current_time) {
        const mins = Math.floor(latestProg.current_time / 60)
        const secs = Math.floor(latestProg.current_time % 60)
        lastPosition = `${mins}:${secs.toString().padStart(2, '0')}`
      }

      return {
        ...enrollment,
        lastPosition,
        lastLessonTitle: latestProg?.modules?.title || ''
      }
    })

    res.json(enriched)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
