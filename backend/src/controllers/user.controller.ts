import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // In a real app, you might want to fetch from 'profiles' table join with auth.users
    // For now, let's fetch from the service role allowed user list or profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const { data, error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', id)
      .select()

    if (error) throw error

    res.json(data[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
