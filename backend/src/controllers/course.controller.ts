import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

// ─── Get all published courses (excludes archived) ──────────────
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { status, tier } = req.query

    let query = supabase
      .from('courses')
      .select('*, modules(id, title, order)')
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
      .select('*, modules(*, lessons(*))')
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
    const { title, description, tier_access, level, thumbnail, duration_minutes, status } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Course title is required' })
    }

    const courseData = {
      title,
      description: description || '',
      tier_access: tier_access || 'free',
      level: level || 'Beginner',
      thumbnail_url: thumbnail || null,
      duration: duration_minutes ? duration_minutes.toString() : '0',
      is_published: status === 'published' || status === 'active'
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
    const { title, description, tier_access, level, thumbnail, duration_minutes, status } = req.body
    
    const courseData: any = {}

    if (title !== undefined) courseData.title = title
    if (description !== undefined) courseData.description = description
    if (tier_access !== undefined) courseData.tier_access = tier_access
    if (level !== undefined) courseData.level = level
    if (thumbnail !== undefined) courseData.thumbnail_url = thumbnail
    if (duration_minutes !== undefined) courseData.duration = duration_minutes.toString()
    if (status !== undefined) courseData.is_published = status === 'published' || status === 'active'

    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
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

    const { data, error } = await supabase
      .from('courses')
      .update({
        archived_at: new Date().toISOString(),
        is_published: false
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('[COURSE_ARCHIVE_ERROR] Database Error:', error.message)
      throw error
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Course not found' })
    }

    res.json({ message: 'Course archived successfully', course: data[0] })
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

    const { data, error } = await supabase
      .from('enrollments')
      .select('*, courses(*, modules(id, title, order))')
      .eq('user_id', userId)

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
