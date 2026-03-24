import { Request, Response } from 'express'
import crypto from 'crypto'
import { supabase } from '../config/supabase'

/**
 * Handle incoming webhooks from Paystack
 */
export const handlePaystackWebhook = async (req: Request, res: Response) => {
  try {
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
      .update(JSON.stringify(req.body))
      .digest('hex')

    if (hash !== req.headers['x-paystack-signature']) {
      console.warn('[WEBHOOK] Invalid Paystack signature')
      return res.status(401).send('Invalid signature')
    }

    const event = req.body

    // We only care about charge.success
    if (event.event === 'charge.success') {
      const { reference, metadata, amount, customer } = event.data
      const userId = metadata?.user_id
      const tierId = metadata?.tier_id

      console.log(`[WEBHOOK] Payment successful: Ref ${reference}, User ${userId}`)

      // 1. Update Payment record
      await supabase
        .from('payments')
        .update({ 
          status: 'completed', 
          amount: amount / 100, // Paystack is in kobo
          updated_at: new Date().toISOString() 
        })
        .eq('reference', reference)

      // 2. Upgrade User Subscription
      if (userId && tierId) {
        // Fetch tier name to update user role if necessary
        const { data: tier } = await supabase
          .from('subscription_tiers')
          .select('name')
          .eq('id', tierId)
          .single()

        const newRole = tier?.name === 'ELITE' || tier?.name === 'PRO' ? 'professional' : 'painter'

        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            tier_id: tierId,
            status: 'active',
            last_payment_ref: reference,
            updated_at: new Date().toISOString()
          })

        // 3. Update User Profile Role & Status
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: { role: newRole }
        })

        await supabase
          .from('profiles')
          .update({ 
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          
        console.log(`[WEBHOOK] User ${userId} upgraded to ${newRole}`)
      }
    }

    res.status(200).send('Webhook processed')
  } catch (error: any) {
    console.error('[WEBHOOK_ERROR]', error.message)
    res.status(500).send('Internal Server Error')
  }
}

/**
 * Handle incoming webhooks from Monnify
 * Note: Infrastructure ready, verify signatures with MONNIFY_SECRET_KEY in production
 */
export const handleMonnifyWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['monnify-signature']
    const secretKey = process.env.MONNIFY_SECRET_KEY || ''
    
    // 1. Signature Verification (Placeholder until Monnify Key is provided)
    if (secretKey) {
      const computedHash = crypto
        .createHmac('sha512', secretKey)
        .update(JSON.stringify(req.body))
        .digest('hex')

      if (computedHash !== signature) {
        console.warn('[WEBHOOK] Invalid Monnify signature')
        return res.status(401).send('Invalid signature')
      }
    }

    const event = req.body
    console.log(`[WEBHOOK] Monnify Event: ${event.eventType}`)

    // Handle DIFFERENT event types (e.g. SUCCESSFULL_TRANSACTION)
    if (event.eventType === 'SUCCESSFUL_TRANSACTION') {
      const { transactionReference, customerEmail, paymentStatus, metaData } = event.eventData
      const userId = metaData?.userId
      const tierId = metaData?.tierId

      if (paymentStatus === 'PAID') {
        console.log(`[WEBHOOK] Monnify Payment success: ${transactionReference}`)
        
        // REUSABLE LOGIC: Extract this into a subscriptionService.activateSubscription if growing
        // For now, mirroring Paystack logic
        if (userId && tierId) {
            const { data: tier } = await supabase
                .from('subscription_tiers')
                .select('name')
                .eq('id', tierId)
                .single()

            const newRole = tier?.name === 'ELITE' || tier?.name === 'PRO' ? 'professional' : 'painter'

            await supabase.from('subscriptions').upsert({
                user_id: userId,
                tier_id: tierId,
                status: 'active',
                last_payment_ref: transactionReference,
                updated_at: new Date().toISOString()
            })

            await supabase.auth.admin.updateUserById(userId, { user_metadata: { role: newRole } })
            await supabase.from('profiles').update({ status: 'active' }).eq('id', userId)
            
            console.log(`[WEBHOOK] User ${userId} upgraded via Monnify`)
        }
      }
    }

    res.status(200).send('Webhook processed')
  } catch (error: any) {
    console.error('[MONNIFY_ERROR]', error.message)
    res.status(500).send('Internal Server Error')
  }
}
