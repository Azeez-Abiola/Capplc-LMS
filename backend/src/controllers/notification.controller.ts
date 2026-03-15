import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    res.json({ message: 'Notification marked as read' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)

    if (error) throw error

    res.json({ message: 'All notifications marked as read' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
