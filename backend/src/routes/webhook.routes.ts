import { Router } from 'express'
import { handlePaystackWebhook, handleMonnifyWebhook } from '../controllers/webhook.controller'

const router = Router()

// Public endpoints for Payment Gateways
router.post('/paystack', handlePaystackWebhook)
router.post('/monnify', handleMonnifyWebhook)

export default router
