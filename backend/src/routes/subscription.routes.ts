import { Router } from 'express'
import { getAllTiers, getUserSubscription, updateSubscription } from '../controllers/subscription.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/tiers', getAllTiers)
router.get('/current', authenticate, getUserSubscription)
router.post('/update', authenticate, updateSubscription)

export default router
