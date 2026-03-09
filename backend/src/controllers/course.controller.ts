import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createCourse = async (req: Request, res: Response) => {
  try {
    const courseData = req.body
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()

    if (error) throw error

    res.status(201).json(data[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const courseData = req.body
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', id)
      .select()

    if (error) throw error

    res.json(data[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

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

export const getEnrolledCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { data, error } = await supabase
      .from('enrollments')
      .select('*, courses(*)')
      .eq('user_id', userId)

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
