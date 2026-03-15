import { Router } from 'express'
import { getAdminStats, getUserStats, getDetailedEngagement } from '../controllers/analytics.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()

router.get('/admin', authenticate, authorize(['admin']), getAdminStats)
router.get('/admin/detailed', authenticate, authorize(['admin']), getDetailedEngagement)
router.get('/user', authenticate, getUserStats)

export default router
