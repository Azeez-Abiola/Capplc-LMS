import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

// ─── Get all modules for a course ───────────────────────────────
export const getModulesByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params

    const { data, error } = await supabase
      .from('modules')
      .select('*, lessons(*)')
      .eq('course_id', courseId)
      .order('order', { ascending: true })

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// ─── Get a single module by id ──────────────────────────────────
export const getModuleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('modules')
      .select('*, lessons(*)')
      .eq('id', id)
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// ─── Create a new module ────────────────────────────────────────
export const createModule = async (req: Request, res: Response) => {
  try {
    const { course_id, title, description, order, duration, video_url } = req.body

    if (!course_id || !title) {
      return res.status(400).json({ error: 'course_id and title are required' })
    }

    // If no order provided, place at end
    let moduleOrder = order
    if (moduleOrder === undefined) {
      const { count } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', course_id)

      moduleOrder = (count || 0) + 1
    }

    const { data, error } = await supabase
      .from('modules')
      .insert([{ course_id, title, description, order: moduleOrder, duration, video_url }])
      .select()

    if (error) throw error

    res.status(201).json(data[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// ─── Update a module ────────────────────────────────────────────
export const updateModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('modules')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Module not found' })
    }

    res.json(data[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// ─── Delete a module ────────────────────────────────────────────
export const deleteModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.status(204).send()
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// ─── Reorder modules within a course ────────────────────────────
export const reorderModules = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params
    const { orderedIds } = req.body // Array of module IDs in desired order

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array of module IDs' })
    }

    // Update each module's order
    const updates = orderedIds.map((id: string, index: number) =>
      supabase
        .from('modules')
        .update({ order: index + 1 })
        .eq('id', id)
        .eq('course_id', courseId)
    )

    await Promise.all(updates)

    // Return the updated list
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order', { ascending: true })

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
