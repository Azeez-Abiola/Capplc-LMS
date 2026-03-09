import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

export const getAllTiers = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('subscription_tiers')
      .select('*')
      .order('price', { ascending: true })

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getUserSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, subscription_tiers(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"

    res.json(data || { message: 'No active subscription found' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { tier_id } = req.body
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({ 
        user_id: userId, 
        tier_id, 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) throw error

    res.json(data[0])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
