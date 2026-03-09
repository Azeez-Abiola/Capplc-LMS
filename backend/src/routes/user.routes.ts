import { Router } from 'express'
import { getAllUsers, getUserById, updateUserStatus, getProfile } from '../controllers/user.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()

// Public profile or authenticated profile
router.get('/profile', authenticate, getProfile)

// Admin only routes
router.get('/', authenticate, authorize(['admin']), getAllUsers)
router.get('/:id', authenticate, authorize(['admin']), getUserById)
router.put('/:id/status', authenticate, authorize(['admin']), updateUserStatus)

export default router
