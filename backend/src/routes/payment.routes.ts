import { Router } from 'express'
import { initializePayment, verifyPayment, getPaymentHistory } from '../controllers/payment.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/initialize', authenticate, initializePayment)
router.post('/verify', authenticate, verifyPayment)
router.get('/history', authenticate, getPaymentHistory)

export default router
