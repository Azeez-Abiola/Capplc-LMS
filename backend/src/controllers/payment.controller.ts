import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

export const initializePayment = async (req: Request, res: Response) => {
  try {
    const { tier_id, amount } = req.body
    const userId = req.user?.id

    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    // In a real app, this would integrate with Monnify or another gateway
    // and return a reference
    const reference = `CAP-REF-${Date.now()}`

    const { data, error } = await supabase
      .from('payments')
      .insert([{
        user_id: userId,
        amount,
        tier_id,
        reference,
        status: 'pending'
      }])
      .select()

    if (error) throw error

    res.json({
      message: 'Payment initialized',
      reference,
      data: data[0]
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { reference } = req.body
    
    // In a real app, verify with the provider API here
    
    const { data, error } = await supabase
      .from('payments')
      .update({ status: 'completed' })
      .eq('reference', reference)
      .select()

    if (error) throw error

    // Also update user subscription status here
    const payment = data[0]
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: payment.user_id,
        tier_id: payment.tier_id,
        status: 'active',
        last_payment_ref: reference
      })

    res.json({ message: 'Payment verified and subscription activated', data: payment })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const { data, error } = await supabase
      .from('payments')
      .select('*, subscription_tiers(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
