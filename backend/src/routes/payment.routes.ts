import { Router } from 'express'
import { initializePayment, verifyPayment, getPaymentHistory, getAllPaymentsMonitor } from '../controllers/payment.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()

router.post('/initialize', authenticate, initializePayment)
router.post('/verify', authenticate, verifyPayment)
router.get('/history', authenticate, getPaymentHistory)
router.get('/admin/all', authenticate, authorize(['admin']), getAllPaymentsMonitor)

export default router
